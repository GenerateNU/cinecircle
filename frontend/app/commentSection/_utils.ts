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
