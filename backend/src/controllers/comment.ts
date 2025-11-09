import { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../services/db";

/**
 * GET /api/comment/:id
 * Query params: includeReplies=true (optional)
 */
export const getComment = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] getComment called by user: ${req.user?.id || "unknown"}`,
  );

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
      ...(includeReplies === "true" && {
        include: {
          child_comment: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      }),
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
 * POST /api/comment
 * Body: { content: string, postId?: string, ratingId?: string, parentId?: string }
 */
export const createComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] createComment called by user: ${req.user?.id || "unknown"}`,
  );

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comment",
    });
  }

  const { content, ratingId, postId, parentId } = req.body;

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
        userId: req.user.id,
        ratingId: ratingId ?? null,
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
export const updateComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] updateComment called by user: ${req.user?.id || "unknown"}`,
  );

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
export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] deleteComment called by user: ${req.user?.id || "unknown"}`,
  );

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
