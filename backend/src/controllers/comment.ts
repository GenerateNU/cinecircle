import { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../services/db";

/**
 * GET /api/comments/:id
 */
export const getComment = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] getComment called by user: ${req.user?.id || "unknown"}`);

  if (!req.user) {
    console.log(`[${timestamp}] getComment failed: Unauthorized`);
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comments/:id",
    });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Missing comment ID",
      timestamp,
      endpoint: "/api/comments/:id",
    });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
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
 * POST /api/comments
 * Body: { content: string, postId?: string, ratingId?: string }
 */
export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] createComment called by user: ${req.user?.id || "unknown"}`);

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comments",
    });
  }

  const { content, postId, ratingId } = req.body;

  if (!content || (typeof content !== "string" && content.trim() === "")) {
    return res.status(400).json({
      message: "Content is required to create a comment",
      timestamp,
      endpoint: "/api/comments",
    });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: postId ?? null,
        ratingId: ratingId ?? null,
        userId: req.user.id,
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
 * PUT /api/comments/:id
 * Body: { content?: string }
 */
export const updateComment = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] updateComment called by user: ${req.user?.id || "unknown"}`);

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comments/:id",
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
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] deleteComment called by user: ${req.user?.id || "unknown"}`);

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
      timestamp,
      endpoint: "/api/comments/:id",
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