import { Request, Response } from "express";
import { prisma } from "../services/db.js";
import { Prisma } from "@prisma/client";

// CREATE POST
export const createPost = async (req: Request, res: Response) => {
    try {
      const { userId, content, type, imageUrls, repostedPostId, movieId, stars, spoiler, tags } = req.body;
  
      // Validation
      if (!userId || !content) {
        return res.status(400).json({ 
          message: "userId and content are required" 
        });
      }

      if (!movieId) {
        return res.status(400).json({
          message: "movieId is required - all posts must reference a movie"
        });
      }
  
      if (type && !["LONG", "SHORT"].includes(type)) {
        return res.status(400).json({ 
          message: "Invalid type. Must be LONG or SHORT" 
        });
      }

      // Validate stars if provided
      if (stars !== undefined && stars !== null) {
        const starsNum = parseInt(stars, 10);
        if (isNaN(starsNum) || starsNum < 0 || starsNum > 10) {
          return res.status(400).json({
            message: "Stars must be between 0 and 10"
          });
        }
        
        // SHORT posts cannot have stars
        if (type === "SHORT" || (!type && content.length <= 280)) {
          return res.status(400).json({
            message: "SHORT posts cannot have star ratings"
          });
        }
      }

      // If it's a repost, verify original post exists
      if (repostedPostId) {
        const originalPost = await prisma.post.findUnique({
          where: { id: repostedPostId },
        });
        if (!originalPost) {
          return res.status(404).json({ message: "Original post not found" });
        }
      }
  
      const newPost = await prisma.post.create({
        data: {
          userId,
          movieId,
          content,
          type: type || "SHORT",
          stars: stars ? parseInt(stars, 10) : null,
          spoiler: spoiler || false,
          tags: tags || [],
          imageUrls: imageUrls || [],
          repostedPostId,
        },
        include: {
          UserProfile: {
            select: {
              userId: true,
              username: true,
            },
          },
          movie: {
            select: {
              movieId: true,
              title: true,
              imageUrl: true,
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
          movie: {
            select: {
              movieId: true,
              title: true,
              imageUrl: true,
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
          other_Post: {
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
          Reposts: post.other_Post,
          reactionCount: post.PostReaction.length,
          commentCount: post.Comment.length,
          repostCount: post.other_Post.length,
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
        movieId,
        repostedPostId, 
        limit = "20", 
        offset = "0",
        currentUserId // Optional: for getting user's reactions
      } = req.query;
  
      const where: Prisma.PostWhereInput = {};
      
      if (userId) where.userId = userId as string;
      if (type) where.type = type as "LONG" | "SHORT";
      if (movieId) where.movieId = movieId as string;
      if (repostedPostId === "null") {
        where.repostedPostId = null; // Original posts only (not reposts)
      } else if (repostedPostId) {
        where.repostedPostId = repostedPostId as string; // Get reposts of a specific post
      }

      // Get current user's reactions if provided
      let userReactionsByPost = new Map<string, string[]>();
      if (currentUserId) {
        const userReactions = await prisma.postReaction.findMany({
          where: { userId: currentUserId as string },
          select: { postId: true, reactionType: true },
        });
        
        userReactions.forEach(reaction => {
          const existing = userReactionsByPost.get(reaction.postId) || [];
          existing.push(reaction.reactionType);
          userReactionsByPost.set(reaction.postId, existing);
        });
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
          movie: {
            select: {
              movieId: true,
              title: true,
              imageUrl: true,
            },
          },
          PostReaction: {
            select: {
              reactionType: true,
            },
          },
          Comment: {
            select: {
              id: true,
            },
          },
          other_Post: {
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
  
      const postsWithCounts = posts.map((post) => {
        // Count reactions by type
        const reactionCounts = post.PostReaction.reduce((acc: Record<string, number>, r: any) => {
          acc[r.reactionType] = (acc[r.reactionType] || 0) + 1;
          return acc;
        }, {});

        return {
          ...post,
          Reposts: post.other_Post,
          reactionCount: post.PostReaction.length,
          reactionCounts,
          userReactions: userReactionsByPost.get(post.id) || [],
          commentCount: post.Comment.length,
          repostCount: post.other_Post.length,
        };
      });
  
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

// GET POST REPOSTS - Get all reposts/shares of a specific post
export const getPostReposts = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
  
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }
  
      const reposts = await prisma.post.findMany({
        where: { repostedPostId: postId },
        include: {
          UserProfile: {
            select: {
              userId: true,
              username: true,
            },
          },
          PostReaction: true,
          other_Post: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      const repostsWithCounts = reposts.map((repost) => ({
        ...repost,
        Reposts: repost.other_Post,
        reactionCount: repost.PostReaction?.length || 0,
        repostCount: repost.other_Post.length,
      }));
  
      res.json({
        message: "Reposts retrieved successfully",
        data: repostsWithCounts,
        count: reposts.length,
      });
    } catch (err) {
      console.error("getPostReposts error:", err);
      res.status(500).json({
        message: "Failed to retrieve reposts",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };
