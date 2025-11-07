import { pipeline } from "@xenova/transformers";
import type { Rating, Comment } from "../../types/models";

export type Summary = {
  overall: string;
  pros: string[];
  cons: string[];
  stats: { positive: number; neutral: number; negative: number; total: number };
  quotes: string[];
};

let embedder: any;
let sentimentPipe: any;

async function initModels() {
  if (!embedder) embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  if (!sentimentPipe) sentimentPipe = await pipeline("sentiment-analysis", "Xenova/distilbert-base-uncased-finetuned-sst-2-english");
}

/**
 * Use your domain objects directly: Rating[] + Comment[] in → Summary out.
 * - Uses Rating.comment + Comment.content as text
 * - Uses Rating.votes as "helpfulness"
 * - Uses Rating.tags to lightly boost sentences that mention those tags
 * - Recency via Rating.date / Comment.createdAt
 */
export async function summarizeFromDomain(
  ratings: Rating[],
  comments: Comment[],
  opts?: { k?: number; mmrLambda?: number; prosMax?: number; consMax?: number; tagBoost?: number }
): Promise<Summary> {
  await initModels();

  const k = opts?.k ?? 8;
  const lambda = opts?.mmrLambda ?? 0.7;
  const prosMax = opts?.prosMax ?? 3;
  const consMax = opts?.consMax ?? 3;
  const tagBoost = opts?.tagBoost ?? 0.10; // +10% weight if sentence mentions a rating tag

  // 1) Gather source strings and per-source metadata (no new types created)
  type Source = {
    kind: "rating" | "comment";
    index: number;                 // index into ratings/comments
    text: string;
  };

  const sources: Source[] = [];
  ratings.forEach((r, i) => {
    const t = (r.comment ?? "").trim();
    if (t) sources.push({ kind: "rating", index: i, text: t });
  });
  comments.forEach((c, i) => {
    const t = (c.content ?? "").trim();
    if (t) sources.push({ kind: "comment", index: i, text: t });
  });

  if (sources.length === 0) return emptySummary();

  // 2) Split to sentences and remember which source each sentence came from
  const sentences: string[] = [];
  const sentToSource: number[] = []; // points into sources[]
  for (let sIdx = 0; sIdx < sources.length; sIdx++) {
    const sents = splitSentences(sources[sIdx].text);
    for (const s of sents) {
      sentences.push(s);
      sentToSource.push(sIdx);
    }
  }
  if (sentences.length === 0) return emptySummary();

  // 3) Embed + score coverage vs centroid
  const vecs = await Promise.all(sentences.map(async s => toVector(await embedder(s))));
  const centroid = meanVector(vecs);
  let coverage = vecs.map(v => cosine(v, centroid));

  // 4) Helpfulness weights from YOUR objects (votes, recency, tags)
  const weights = sentences.map((sent, i) => {
    const src = sources[sentToSource[i]];
    let likes = 0, createdIso: string | undefined, rep = 0.5, boost = 1;

    if (src.kind === "rating") {
      const r = ratings[src.index];
      likes = r.votes ?? 0;
      createdIso = r.date;
      // Tag boost: if sentence contains any tag, give a small bump
      if (Array.isArray(r.tags) && r.tags.length) {
        const lower = sent.toLowerCase();
        if (r.tags.some(tag => lower.includes(String(tag).toLowerCase()))) {
          boost += tagBoost; // e.g., 1.10
        }
      }
    } else {
      const c = comments[src.index];
      createdIso = c.createdAt;
      // If you later add comment votes/likes, wire them here.
    }

    const ageDays = createdIso ? Math.max(1, (Date.now() - new Date(createdIso).getTime()) / 86400000) : 30;
    const timeDecay = 1 / Math.sqrt(ageDays);           // recent > old
    const likeFactor = 1 + Math.log10(1 + Math.max(0, likes));
    const repFactor = 0.5 + 0.5 * rep;                  // placeholder; set real rep if you track it

    return likeFactor * repFactor * timeDecay * boost;
  });

  // Combine coverage with weights
  let scores = coverage.map((c, i) => c * weights[i]);

  // 5) Diversity via MMR
  const pickedIdx = mmrPick(vecs, scores, k, lambda);
  const picked = pickedIdx.map(i => sentences[i]);

  // 6) Sentiment stats + Pros/Cons + Overall
  const sample = sentences.slice(0, Math.min(250, sentences.length));
  const sentiAll = await sentimentPipe(sample);
  const stats = tallySentiment(sentiAll);

  const sentiPicked = await sentimentPipe(picked);
  const pros: string[] = [];
  const cons: string[] = [];
  picked.forEach((line, i) => {
    const lab = sentiPicked[i]?.label;
    if (lab === "POSITIVE" && pros.length < prosMax) pros.push(clean(line));
    if (lab === "NEGATIVE" && cons.length < consMax) cons.push(clean(line));
  });

  const overall = buildOverall(picked, sentiPicked);

  return { overall, pros, cons, stats, quotes: picked.map(clean) };
}

/* ---------------- helpers (same as before) ---------------- */

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/)
    .map(s => s.trim())
    .filter(s => s.length >= 25 && s.length <= 280);
}

function toVector(tensor: any): number[] {
  // Prefer TypedArray path
  // @ts-ignore
  if (tensor?.data && typeof tensor.data.length === "number") {
    return Array.from(tensor.data as Float32Array);
  }
  // Fallback: average tokens
  const arr = Array.isArray(tensor) ? tensor : tensor?.[0] ?? [];
  return flattenMean(arr);
}

function flattenMean(x: any): number[] {
  if (Array.isArray(x) && Array.isArray(x[0]) && typeof x[0][0] === "number") {
    const tokens = x as number[][];
    const d = tokens[0].length;
    const out = new Array(d).fill(0);
    for (const t of tokens) for (let i = 0; i < d; i++) out[i] += t[i];
    for (let i = 0; i < d; i++) out[i] /= tokens.length;
    return out;
  }
  if (Array.isArray(x) && typeof x[0] === "number") return x as number[];
  return [];
}

function meanVector(vecs: number[][]): number[] {
  const d = vecs[0].length;
  const out = new Array(d).fill(0);
  for (const v of vecs) for (let i = 0; i < d; i++) out[i] += v[i];
  for (let i = 0; i < d; i++) out[i] /= vecs.length;
  return out;
}

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

function mmrPick(vecs: number[][], baseScores: number[], k: number, lambda: number) {
  const chosen: number[] = [];
  const cand = new Set(vecs.map((_, i) => i));
  while (chosen.length < k && cand.size > 0) {
    let best = -1, bestScore = -Infinity;
    for (const i of cand) {
      const penalty = chosen.length ? Math.max(...chosen.map(j => cosine(vecs[i], vecs[j]))) : 0;
      const score = lambda * baseScores[i] - (1 - lambda) * penalty;
      if (score > bestScore) { bestScore = score; best = i; }
    }
    chosen.push(best);
    cand.delete(best);
  }
  return chosen;
}

function tallySentiment(senti: any[]) {
  let pos = 0, neg = 0, neu = 0;
  for (const s of senti) {
    if (s.label === "POSITIVE") pos++;
    else if (s.label === "NEGATIVE") neg++;
    else neu++;
  }
  const total = senti.length || 1;
  return {
    positive: Math.round((pos / total) * 100),
    neutral: Math.round((neu / total) * 100),
    negative: Math.round((neg / total) * 100),
    total
  };
}

function clean(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function buildOverall(lines: string[], labels: { label: string }[]) {
  const pos: string[] = [], neg: string[] = [];
  lines.forEach((l, i) => (labels[i]?.label === "NEGATIVE" ? neg : pos).push(clean(l)));
  const pick: string[] = [];
  if (pos.length) pick.push(pos[0]);
  if (neg.length) pick.push(neg[0]);
  if (pos.length > 1) pick.push(pos[1]);
  return pick.slice(0, 3).join(" ");
}

function emptySummary(): Summary {
  return { overall: "", pros: [], cons: [], stats: { positive: 0, neutral: 0, negative: 0, total: 0 }, quotes: [] };
}
