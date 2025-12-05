import { Response, Request } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../services/db";
import { randomUUID } from "crypto";

/**
 * GET /api/comment/:id
 * Query params: includeReplies=true (optional)
 */
export const getComment = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] getComment called by user: ${req.user?.id || "unknown"}`);

  if (!req.user) {
    console.log(`[${timestamp}] getComment failed: Unauthorized`);
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comment/:id",
    });
  }

  const { id } = req.params;
  const { includeReplies } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Missing comment ID",
      timestamp,
      endpoint: "/api/comment/:id",
    });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
      ...(includeReplies === 'true' && {
        include: {
          child_comment: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      })
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found", timestamp });
    }

    res.json({
      message: "Comment retrieved successfully",
      comment,
      timestamp,
    });
  } catch (error) {
    console.error(`[${timestamp}] getComment error:`, error);
    res.status(500).json({
      message: "Internal server error retrieving comment",
      timestamp,
    });
  }
};

/**
 * GET /api/comments/post/:postId
 * Returns a flat list of comments for the post
 */
export const getCommentsTree = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  const { postId } = req.params;
  const userId = req.user?.id;

  if (!postId) {
    return res.status(400).json({
      message: "Missing postId",
      timestamp,
    });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        UserProfile: { select: { userId: true, username: true, profilePicture: true } },
        CommentLike: true,
      }
    });

    // Transform to include like count and whether current user liked
    const commentsWithLikes = comments.map((comment) => ({
      id: comment.id,
      userId: comment.userId,
      postId: comment.postId,
      parentId: comment.parentId,
      content: comment.content,
      createdAt: comment.createdAt,
      UserProfile: comment.UserProfile,
      likeCount: comment.CommentLike.length,
      liked: userId ? comment.CommentLike.some((like) => like.userId === userId) : false,
    }));

    // Return flat list - client builds tree
    res.json({ message: "Comments retrieved", comments: commentsWithLikes });
  } catch (error) {
    console.error(`[${timestamp}] getCommentsTree error:`, error);
    res.status(500).json({
      message: "Internal server error retrieving comments",
      timestamp,
    });
  }
};

/**
 * POST /api/comment
 * Body: { content: string, postId?: string, ratingId?: string, parentId?: string }
 */
export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] createComment called by user: ${req.user?.id || "unknown"}`);

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comment",
    });
  }

  const { content, postId, parentId } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({
      message: "Content is required to create a comment",
      timestamp,
      endpoint: "/api/comment",
    });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        id: randomUUID(),
        userId: req.user.id,
        postId: postId ?? null,
        parentId: parentId ?? null,
        content: content,
      },
    });

    res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
      timestamp,
    });
  } catch (error) {
    console.error(`[${timestamp}] createComment error:`, error);
    res.status(500).json({
      message: "Internal server error creating comment",
      timestamp,
    });
  }
};

/**
 * PUT /api/comment/:id
 * Body: { content?: string }
 */
export const updateComment = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] updateComment called by user: ${req.user?.id || "unknown"}`);

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comment/:id",
    });
  }

  const { id } = req.params;
  const { content } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Missing comment ID",
      timestamp,
    });
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({
      message: "Content must be a non-empty string",
      timestamp,
    });
  }

  try {
    const existing = await prisma.comment.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Comment not found", timestamp });
    }

    // Only allow user to edit their own comment
    if (existing.userId !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to edit this comment",
        timestamp,
      });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.json({
      message: "Comment updated successfully",
      comment: updatedComment,
      timestamp,
    });
  } catch (error) {
    console.error(`[${timestamp}] updateComment error:`, error);
    res.status(500).json({
      message: "Internal server error updating comment",
      timestamp,
    });
  }
};

/**
 * DELETE /api/comment/:id
 */
export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] deleteComment called by user: ${req.user?.id || "unknown"}`);

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comment/:id",
    });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Missing comment ID",
      timestamp,
    });
  }

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found", timestamp });
    }

    // Only allow user to delete their own comment
    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this comment",
        timestamp,
      });
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.json({
      message: "Comment deleted successfully",
      timestamp,
    });
  } catch (error) {
    console.error(`[${timestamp}] deleteComment error:`, error);
    res.status(500).json({
      message: "Internal server error deleting comment",
      timestamp,
    });
  }
};

/**
 * POST /api/comment/:id/like
 * Toggles a like on a comment for the authenticated user
 */
export const toggleCommentLike = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] toggleCommentLike called by user: ${req.user?.id || "unknown"}`);

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comment/:id/like",
    });
  }

  const { id: commentId } = req.params;

  if (!commentId) {
    return res.status(400).json({
      message: "Missing comment ID",
      timestamp,
    });
  }

  try {
    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found", timestamp });
    }

    // Check if user already liked this comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: req.user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.commentLike.delete({
        where: { id: existingLike.id },
      });

      const likeCount = await prisma.commentLike.count({
        where: { commentId },
      });

      return res.json({
        message: "Comment unliked successfully",
        liked: false,
        likeCount,
        timestamp,
      });
    } else {
      // Like - add a new like
      await prisma.commentLike.create({
        data: {
          id: randomUUID(),
          commentId,
          userId: req.user.id,
        },
      });

      const likeCount = await prisma.commentLike.count({
        where: { commentId },
      });

      return res.json({
        message: "Comment liked successfully",
        liked: true,
        likeCount,
        timestamp,
      });
    }
  } catch (error) {
    console.error(`[${timestamp}] toggleCommentLike error:`, error);
    res.status(500).json({
      message: "Internal server error toggling comment like",
      timestamp,
    });
  }
};

/**
 * GET /api/comment/:id/likes
 * Returns the like count and whether the current user has liked the comment
 */
export const getCommentLikes = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comment/:id/likes",
    });
  }

  const { id: commentId } = req.params;

  if (!commentId) {
    return res.status(400).json({
      message: "Missing comment ID",
      timestamp,
    });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found", timestamp });
    }

    const likeCount = await prisma.commentLike.count({
      where: { commentId },
    });

    const userLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: req.user.id,
        },
      },
    });

    res.json({
      message: "Comment likes retrieved successfully",
      likeCount,
      liked: !!userLike,
      timestamp,
    });
  } catch (error) {
    console.error(`[${timestamp}] getCommentLikes error:`, error);
    res.status(500).json({
      message: "Internal server error retrieving comment likes",
      timestamp,
    });
  }
};

// backend/src/controllers/comment.ts
export async function getMovieComments(req: Request, res: Response) {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ message: "movieId is required" });
    }

    // 1) Find all posts for this movie
    const postsForMovie = await prisma.post.findMany({
      where: { movieId },
      select: { id: true },
    });

    const postIds = postsForMovie.map((p) => p.id);
    if (postIds.length === 0) {
      return res.status(200).json({ comments: [] });
    }

    // 2) Find comments that reference those posts
    const commentsFromDb = await prisma.comment.findMany({
      where: {
        postId: { in: postIds },
      },
      orderBy: { createdAt: "desc" },
    });

    // 3) Normalize to frontend Comment shape
    const comments = commentsFromDb.map((c) => ({
      id: c.id,
      userId: c.userId,
      postId: c.postId,
      text: c.content,                 // frontend uses comment.text
      date: c.createdAt.toISOString(), // frontend uses comment.date
      parentId: c.parentId,
    }));

    return res.status(200).json({ comments });
  } catch (err) {
    console.error("Error in getMovieComments:", err);
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
}
