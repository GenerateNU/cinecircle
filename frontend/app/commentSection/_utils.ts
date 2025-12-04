import type { ApiComment } from './_types';

export type CommentNode = ApiComment & { replies: CommentNode[] };

export function buildCommentTree(flat: ApiComment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  flat.forEach((c) => map.set(c.id, { ...c, replies: [] }));

  flat.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

/**
 * Find a comment node by ID within a tree structure.
 * Searches recursively through all nodes and their replies.
 */
export function findCommentById(nodes: CommentNode[], id: string): CommentNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    const found = findCommentById(node.replies, id);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Find the root ancestor of a comment in the tree.
 * Traverses up the tree using parentId references.
 */
export function findRootAncestor(flat: ApiComment[], commentId: string): string {
  const map = new Map<string, ApiComment>();
  flat.forEach((c) => map.set(c.id, c));

  let current = map.get(commentId);
  while (current?.parentId && map.has(current.parentId)) {
    current = map.get(current.parentId);
  }
  return current?.id ?? commentId;
}

/**
 * Format a Date or ISO string into a short relative time label.
 * Examples: "now", "5m", "3h", "2d", "1w", "3mo", "2y".
 */
export function formatRelativeTime(input: string | Date): string {
  const rawDate = typeof input === 'string' ? new Date(input) : input;
  const time = rawDate.getTime();

  // If the date string is not parseable, fall back to the raw string
  if (!isFinite(time)) {
    return typeof input === 'string' ? input : 'now';
  }

  const now = new Date();
  const diffMs = now.getTime() - time;

  // Future dates – treat as "now"
  if (diffMs <= 0) return 'now';

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Within 5 minutes
  if (diffMinutes < 5) return 'now';

  // 5 minutes up to < 1 hour
  if (diffHours < 1) return `${diffMinutes}m`;

  // < 24 hours – hours
  if (diffHours < 24) return `${diffHours}h`;

  // 1–6 days -> days
  if (diffDays < 7) return `${diffDays}d`;

  // 1–3 weeks -> weeks
  if (diffWeeks < 4) return `${diffWeeks}w`;

  // 1–11 months -> months
  if (diffMonths < 12) return `${diffMonths}mo`;

  // 1+ years
  return `${diffYears}y`;
}
