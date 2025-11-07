import type { Request, Response } from "express";
import type { Rating, Comment } from "../types/models";
import { prisma } from "../services/db.js";
import { summarizeFromDomain } from "../services/ai/reviewSummarizer"; // <- domain-aware summarizer

// --- helpers ---
const sha256 = (s: string) =>
  require("crypto").createHash("sha256").update(s).digest("hex");

/** Build a stable hash WITHOUT sending full text (order-invariant) */
function buildStableHashKey(ratings: Rating[], comments: Comment[]) {
  const key = JSON.stringify({
    r: ratings
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((r) => [r.id, r.votes ?? 0, r.date ?? "", (r.comment ?? "").length, r.stars]),
    c: comments
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((c) => [c.id, c.createdAt ?? "", (c.content ?? "").length]),
  });
  return sha256(key);
}

/**
 * POST /summarize/movie
 * Body: { movieId: string, ratings: Rating[], comments: Comment[] }
 * Returns: { message, data: { overall, pros, cons, stats, quotes, hash }, ... }
 */
export const postSummarizeMovie = async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();

  try {
    const { movieId, ratings, comments } = (req.body ?? {}) as {
      movieId?: string;
      ratings?: Rating[];
      comments?: Comment[];
    };

    if (!movieId || !Array.isArray(ratings) || !Array.isArray(comments)) {
      return res.status(400).json({
        message: "Bad request: require { movieId, ratings[], comments[] }",
        timestamp,
        endpoint: "/summarize/movie",
      });
    }

    console.log(
      `[${timestamp}] postSummarizeMovie start: movieId=${movieId} r=${ratings.length} c=${comments.length}`
    );

    // Quick guard: any text to summarize?
    const hasText =
      ratings.some((r) => (r.comment ?? "").trim().length > 0) ||
      comments.some((c) => (c.content ?? "").trim().length > 0);

    if (!hasText) {
      console.log(`[${timestamp}] postSummarizeMovie: no textual content`);
      return res.json({
        message: "No textual reviews/comments to summarize",
        data: {
          overall: "",
          pros: [],
          cons: [],
          stats: { positive: 0, neutral: 0, negative: 0, total: 0 },
          quotes: [],
          hash: null,
        },
        timestamp,
        endpoint: "/summarize/movie",
      });
    }

    const hash = buildStableHashKey(ratings, comments);

    // -------- OPTIONAL CACHE (Prisma model: MovieSummary) --------
    // model MovieSummary {
    //   movieId   String   @id
    //   hash      String
    //   overall   String?
    //   pros      Json?
    //   cons      Json?
    //   stats     Json?
    //   quotes    Json?
    //   updatedAt DateTime @default(now())
    // }
    try {
      const cached = await prisma.movieSummary.findUnique({ where: { movieId } });
      if (cached && cached.hash === hash) {
        console.log(`[${timestamp}] postSummarizeMovie cache HIT for ${movieId}`);
        return res.json({
          message: "Summary (cached)",
          data: {
            overall: cached.overall ?? "",
            pros: (cached.pros as string[]) ?? [],
            cons: (cached.cons as string[]) ?? [],
            stats: (cached.stats as any) ?? {
              positive: 0,
              neutral: 0,
              negative: 0,
              total: 0,
            },
            quotes: (cached.quotes as string[]) ?? [],
            hash,
          },
          timestamp,
          endpoint: "/summarize/movie",
        });
      }
    } catch (e) {
      console.warn(`[${timestamp}] cache read WARN:`, e);
    }

    // ---------- Compute using your domain objects ----------
    const summary = await summarizeFromDomain(ratings, comments, {
      k: 8,
      mmrLambda: 0.7,
      prosMax: 3,
      consMax: 3,
      tagBoost: 0.10, // small bump if sentence matches Rating.tags
    });

    // Save cache (non-fatal if it fails)
    try {
      await prisma.movieSummary.upsert({
        where: { movieId },
        update: {
          hash,
          overall: summary.overall,
          pros: summary.pros,
          cons: summary.cons,
          stats: summary.stats,
          quotes: summary.quotes,
          updatedAt: new Date(),
        },
        create: {
          movieId,
          hash,
          overall: summary.overall,
          pros: summary.pros,
          cons: summary.cons,
          stats: summary.stats,
          quotes: summary.quotes,
        },
      });
      console.log(`[${timestamp}] postSummarizeMovie cache SAVE for ${movieId}`);
    } catch (e) {
      console.warn(`[${timestamp}] cache save WARN:`, e);
    }

    console.log(`[${timestamp}] postSummarizeMovie success for ${movieId}`);

    return res.json({
      message: "Summary generated",
      data: { ...summary, hash },
      timestamp,
      endpoint: "/summarize/movie",
    });
  } catch (error: any) {
    console.error(`[${timestamp}] postSummarizeMovie error:`, error);
    return res.status(500).json({
      message: "Internal server error while summarizing",
      error: error?.message ?? "Unknown error",
      timestamp,
      endpoint: "/summarize/movie",
    });
  }
};
