import { Request, Response } from "express";
import { prisma } from "../services/db.js";
import { Prisma } from "@prisma/client";

// CREATE POST
export const createPost = async (req: Request, res: Response) => {
    try {
      const { userId, content, type, imageUrls, parentPostId } = req.body;
  
      // Validation
      if (!userId || !content) {
        return res.status(400).json({ 
          message: "userId and content are required" 
        });
      }
  
      if (type && !["LONG", "SHORT"].includes(type)) {
        return res.status(400).json({ 
          message: "Invalid type. Must be LONG or SHORT" 
        });
      }

      // If it's a reply, verify parent post exists
      if (parentPostId) {
        const parentPost = await prisma.post.findUnique({
          where: { id: parentPostId },
        });
        if (!parentPost) {
          return res.status(404).json({ message: "Parent post not found" });
        }
      }
  
      const newPost = await prisma.post.create({
        data: {
          userId,
          content,
          type: type || "SHORT_POST",
          imageUrls: imageUrls || [],
          parentPostId,
        },
        include: {
          UserProfile: {
            select: {
              userId: true,
              username: true,
            },
          },
        },
      });
  
      res.status(201).json({
        message: "Post created successfully",
        data: newPost,
      });
    } catch (err) {
      console.error("createPost error:", err);
      res.status(500).json({
        message: "Failed to create post",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };


// GET POST BY ID
export const getPostById = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
  
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }
  
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          UserProfile: {
            select: {
              userId: true,
              username: true,
            },
          },
          Comment: {
            include: {
              UserProfile: {
                select: {
                  userId: true,
                  username: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          PostReaction: true,
          Replies: {
            include: {
              UserProfile: {
                select: {
                  userId: true,
                  username: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.json({
        message: "Post found successfully",
        data: {
          ...post,
          likeCount: post.votes,
          commentCount: post.Comment.length,
          replyCount: post.Replies.length,
        },
      });
    } catch (err) {
      console.error("getPostById error:", err);
      res.status(500).json({
        message: "Failed to retrieve post",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };
  

// GET POSTS (with filters)
export const getPosts = async (req: Request, res: Response) => {
    try {
      const { 
        userId, 
        type,
        parentPostId, 
        limit = "20", 
        offset = "0" 
      } = req.query;
  
      const where: Prisma.PostWhereInput = {};
      
      if (userId) where.userId = userId as string;
      if (type) where.type = type as "LONG" | "SHORT";
      if (parentPostId === "null") {
        where.parentPostId = null; // Top-level posts only
      } else if (parentPostId) {
        where.parentPostId = parentPostId as string;
      }
  
      const posts = await prisma.post.findMany({
        where,
        include: {
          UserProfile: {
            select: {
              userId: true,
              username: true,
            },
          },
          PostReaction: true,
          Comment: {
            select: {
              id: true,
            },
          },
          Replies: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      });
  
      const postsWithCounts = posts.map((post) => ({
        ...post,
        likeCount: post.votes,
        commentCount: post.Comment.length,
        replyCount: post.Replies.length,
      }));
  
      res.json({
        message: "Posts retrieved successfully",
        data: postsWithCounts,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: posts.length,
        },
      });
    } catch (err) {
      console.error("getPosts error:", err);
      res.status(500).json({
        message: "Failed to retrieve posts",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };
  
// UPDATE POST
export const updatePost = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { content, type, imageUrls } = req.body;
  
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }
  
      const updateData: Prisma.PostUpdateInput = {};
      
      if (content !== undefined) updateData.content = content;
      if (type !== undefined) {
        if (!["LONG", "SHORT"].includes(type)) {
          return res.status(400).json({ 
            message: "Invalid type" 
          });
        }
        updateData.type = type;
      }
      if (imageUrls !== undefined) updateData.imageUrls = imageUrls;
  
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }
  
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: updateData,
        include: {
          UserProfile: {
            select: {
              userId: true,
              username: true,
            },
          },
        },
      });
  
      res.json({
        message: "Post updated successfully",
        data: updatedPost,
      });
    } catch (err) {
      console.error("updatePost error:", err);
  
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.status(500).json({
        message: "Failed to update post",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

// DELETE POST
export const deletePost = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
  
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }
  
      await prisma.post.delete({
        where: { id: postId },
      });
  
      res.json({
        message: "Post deleted successfully",
      });
    } catch (err) {
      console.error("deletePost error:", err);
  
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.status(500).json({
        message: "Failed to delete post",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

// TOGGLE REACTION ON POST
export const toggleReaction = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { userId, reactionType } = req.body;
  
      if (!postId || !userId || !reactionType) {
        return res.status(400).json({ 
          message: "postId, userId, and reactionType are required" 
        });
      }

      const validReactions = ["SPICY", "STAR_STUDDED", "THOUGHT_PROVOKING", "BLOCKBUSTER"];
      if (!validReactions.includes(reactionType)) {
        return res.status(400).json({ 
          message: "Invalid reactionType. Must be one of: SPICY, STAR_STUDDED, THOUGHT_PROVOKING, BLOCKBUSTER" 
        });
      }
  
      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Check if this exact reaction already exists
      const existingReaction = await prisma.postReaction.findUnique({
        where: {
          postId_userId_reactionType: {
            postId,
            userId,
            reactionType,
          },
        },
      });
  
      if (existingReaction) {
        // Remove reaction
        await prisma.postReaction.delete({
          where: {
            id: existingReaction.id,
          },
        });
  
        return res.json({
          message: "Reaction removed successfully",
          reacted: false,
          reactionType,
        });
      } else {
        // Add reaction
        await prisma.postReaction.create({
          data: {
            postId,
            userId,
            reactionType,
          },
        });
  
        return res.json({
          message: "Reaction added successfully",
          reacted: true,
          reactionType,
        });
      }
    } catch (err) {
      console.error("toggleReaction error:", err);
      res.status(500).json({
        message: "Failed to toggle reaction",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

// GET POST REACTIONS
export const getPostReactions = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
  
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }
  
      const reactions = await prisma.postReaction.findMany({
        where: { postId },
        include: {
          UserProfile: {
            select: {
              userId: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Group by reaction type with counts
      const reactionCounts = reactions.reduce((acc: Record<string, number>, reaction) => {
        acc[reaction.reactionType] = (acc[reaction.reactionType] || 0) + 1;
        return acc;
      }, {});
  
      res.json({
        message: "Reactions retrieved successfully",
        data: reactions,
        counts: reactionCounts,
        total: reactions.length,
      });
    } catch (err) {
      console.error("getPostReactions error:", err);
      res.status(500).json({
        message: "Failed to retrieve reactions",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

// GET POST REPLIES
export const getPostReplies = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
  
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }
  
      const replies = await prisma.post.findMany({
        where: { parentPostId: postId },
        include: {
          UserProfile: {
            select: {
              userId: true,
              username: true,
            },
          },
          PostReaction: true,
          Replies: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      const repliesWithCounts = replies.map((reply) => ({
        ...reply,
        likeCount: reply.votes,
        replyCount: reply.Replies.length,
      }));
  
      res.json({
        message: "Replies retrieved successfully",
        data: repliesWithCounts,
        count: replies.length,
      });
    } catch (err) {
      console.error("getPostReplies error:", err);
      res.status(500).json({
        message: "Failed to retrieve replies",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };