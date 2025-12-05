// backend/src/services/summaryService.ts
import { prisma } from '../services/db.js';
import OpenAI from 'openai';
import type {
  MovieSummary,
  SentimentStats,
  ChunkSummary,
} from '../types/models';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Tiny in-memory cache: movieId -> { summary, expiresAt }
const summaryCache = new Map<string, { summary: MovieSummary; expiresAt: number }>();
const SUMMARY_TTL_MS = 60 * 60 * 1000; // 1 hour

// Approximate chunk size: chars, not real tokens but good enough
const CHUNK_MAX_CHARS = 4000;

/**
 * Fetch all posts for a movie and extract their textual content.
 * No images or metadata - just the text content of posts.
 */

async function getReviewTextsForMovie(movieId: string): Promise<string[]> {
  // Fetch all posts for this movie (both LONG and SHORT)
  const posts = await prisma.post.findMany({
    where: { movieId },
    select: {
      id: true,
      content: true,
      stars: true,
      type: true,
    },
  });

  const texts: string[] = [];

  // Extract textual content from posts
  for (const post of posts) {
    if (post.content) {
      // If post has stars (it's a review), include the rating in context
      if (post.stars !== null && post.stars !== undefined) {
        texts.push(`Review (${post.stars}/10): ${post.content}`);
      } else {
        // Regular post without stars
        texts.push(`Post: ${post.content}`);
      }
    }
  }

  return texts;
}


/**
 * Simple char-based chunking: group lines into chunks up to CHUNK_MAX_CHARS.
 */
function chunkTexts(texts: string[], maxChars = CHUNK_MAX_CHARS): string[] {
  const chunks: string[] = [];
  let current = '';

  for (const t of texts) {
    const addition = (current ? '\n\n' : '') + t;
    if (current.length + addition.length > maxChars) {
      if (current) chunks.push(current);
      current = t; // start new chunk with current text
    } else {
      current += addition;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}


/**
 * Analyze a single chunk of reviews using the LLM and return a ChunkSummary.
 */
async function summarizeChunk(movieId: string, chunkText: string): Promise<ChunkSummary> {
    console.log(`Summarizing movie ${movieId} with ${chunkText.length} characters in chunk`);

  const systemPrompt = `
You are an assistant that analyzes user posts about a movie and produces a SHORT, structured summary for this chunk only.

You MUST return ONLY valid JSON with this exact shape:
{
  "pros": string[],         // bullet-style things people liked in this chunk
  "cons": string[],         // bullet-style complaints in this chunk
  "stats": {
    "positive": number,     // # of clearly positive items in this chunk
    "neutral": number,      // # of mixed / neutral in this chunk
    "negative": number,     // # of clearly negative in this chunk
    "total": number         // total # of items in this chunk
  },
  "quotes": string[]        // 1–3 short representative quotes (avoid major spoilers)
}
Do NOT include any extra keys or commentary. 
Keep spoilers to a minimum if possible.
`.trim();

  const userPrompt = `
Movie ID: ${movieId}

Here is one CHUNK of user posts about this movie:

${chunkText}
`.trim();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from OpenAI for chunk summary');
  }

  let parsed: {
    pros: string[];
    cons: string[];
    stats: SentimentStats;
    quotes: string[];
  };

  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse chunk JSON from LLM:', e, content);
    throw e;
  }

  const stats = parsed.stats ?? {
    positive: 0,
    neutral: 0,
    negative: 0,
    total: 0,
  };

  return {
    pros: parsed.pros ?? [],
    cons: parsed.cons ?? [],
    stats,
    quotes: parsed.quotes ?? [],
  };
}

/**
 * Aggregate multiple ChunkSummary objects into one combined structure.
 */
function aggregateChunkSummaries(
  movieId: string,
  chunkSummaries: ChunkSummary[],
  totalReviews: number,
): Omit<MovieSummary, 'overall'> {
  // Sum stats
  const stats: SentimentStats = {
    positive: 0,
    neutral: 0,
    negative: 0,
    total: 0,
    positivePercent: 0,
    neutralPercent: 0,
    negativePercent: 0,
  };

  const prosSet = new Set<string>();
  const consSet = new Set<string>();
  const quotes: string[] = [];

  for (const cs of chunkSummaries) {
    stats.positive += cs.stats.positive;
    stats.neutral += cs.stats.neutral;
    stats.negative += cs.stats.negative;
    stats.total += cs.stats.total;

    for (const p of cs.pros) {
      const normalized = p.trim();
      if (normalized) prosSet.add(normalized);
    }

    for (const c of cs.cons) {
      const normalized = c.trim();
      if (normalized) consSet.add(normalized);
    }

    for (const q of cs.quotes) {
      if (quotes.length < 5) {
        quotes.push(q);
      }
    }
  }

  // If the model didn't fill stats.total correctly, fall back to the total # of lines
  if (!stats.total) {
    stats.total = totalReviews;
  }

  // Calculate percentages
  if (stats.total > 0) {
    stats.positivePercent = Math.round((stats.positive / stats.total) * 100);
    stats.neutralPercent = Math.round((stats.neutral / stats.total) * 100);
    stats.negativePercent = Math.round((stats.negative / stats.total) * 100);
  }

  const pros = Array.from(prosSet).slice(0, 8);
  const cons = Array.from(consSet).slice(0, 8);

  return {
    movieId,
    pros,
    cons,
    stats,
    quotes,
  };
}

/**
 * Final pass: take aggregated pros/cons/stats/quotes and ask the LLM to write a concise "overall".
 */
async function generateOverallFromAggregates(
  aggregated: Omit<MovieSummary, 'overall'>,
): Promise<string> {
  const { movieId, pros, cons, stats, quotes } = aggregated;

  const systemPrompt = `
You are an assistant that writes a SHORT "overall" paragraph summarizing the sentiment of user posts about a movie.

You will receive aggregated pros, cons, sentiment stats, and a few sample quotes.
Return ONLY a concise paragraph (2–4 sentences).
Avoid major spoilers.
`.trim();

  const userPrompt = `
Movie ID: ${movieId}

Sentiment stats:
- Positive: ${stats.positive}
- Neutral: ${stats.neutral}
- Negative: ${stats.negative}
- Total: ${stats.total}

Pros (things people liked):
${pros.map(p => `- ${p}`).join('\n') || '(none)'}

Cons (common complaints):
${cons.map(c => `- ${c}`).join('\n') || '(none)'}

Representative quotes:
${quotes.map(q => `- "${q}"`).join('\n') || '(none)'}
`.trim();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = completion.choices[0]?.message?.content?.trim() ?? '';
  return content || 'Unable to generate an overall summary at this time.';
}

/**
 * Main entry point: chunked, cached movie summary.
 */
export async function generateMovieSummary(movieId: string): Promise<MovieSummary> {
  // 1) Check cache
  const now = Date.now();
  const cached = summaryCache.get(movieId);
  if (cached && cached.expiresAt > now) {
    return cached.summary;
  }

  // 2) Fetch post texts
  const texts = await getReviewTextsForMovie(movieId);

  if (texts.length === 0) {
    const summary: MovieSummary = {
      movieId,
      overall: 'There are no posts yet for this movie.',
      pros: [],
      cons: [],
      stats: { 
        positive: 0, 
        neutral: 0, 
        negative: 0, 
        total: 0,
        positivePercent: 0,
        neutralPercent: 0,
        negativePercent: 0,
      },
      quotes: [],
    };
    summaryCache.set(movieId, { summary, expiresAt: now + SUMMARY_TTL_MS });
    return summary;
  }

  // 3) Chunk them
  const chunks = chunkTexts(texts);

  // 4) Summarize each chunk in parallel (map step)
  const chunkSummaries = await Promise.all(
    chunks.map(chunk => summarizeChunk(movieId, chunk)),
  );

  // 5) Aggregate (reduce step)
  const aggregatedWithoutOverall = aggregateChunkSummaries(
    movieId,
    chunkSummaries,
    texts.length,
  );

  // 6) Final overall paragraph
  const overall = await generateOverallFromAggregates(aggregatedWithoutOverall);

  const summary: MovieSummary = {
    ...aggregatedWithoutOverall,
    overall,
  };

  // 7) Cache & return
  summaryCache.set(movieId, { summary, expiresAt: now + SUMMARY_TTL_MS });

  return summary;
}
