import type { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { prisma } from "../services/db.js";

/**
 * Create or update an RSVP for an event
 * POST /api/event-rsvp
 */
export const createOrUpdateRsvp = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId, status } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!eventId || !status) {
    return res.status(400).json({ message: "Event ID and status are required." });
  }

  if (!['yes', 'maybe', 'no'].includes(status)) {
    return res.status(400).json({ message: "Status must be 'yes', 'maybe', or 'no'." });
  }

  try {
    // Check if event exists
    const event = await prisma.local_event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Upsert the RSVP (create if doesn't exist, update if it does)
    const rsvp = await prisma.event_rsvp.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      update: {
        status,
        updatedAt: new Date(),
      },
      create: {
        eventId,
        userId,
        status,
      },
      include: {
        UserProfile: {
          select: {
            userId: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "RSVP saved successfully.",
      data: {
        id: rsvp.id,
        eventId: rsvp.eventId,
        userId: rsvp.userId,
        status: rsvp.status,
        createdAt: rsvp.createdAt,
        updatedAt: rsvp.updatedAt,
        user: rsvp.UserProfile,
      },
    });
  } catch (err) {
    console.error("Error creating/updating RSVP:", err);
    res.status(500).json({
      message: "Failed to save RSVP.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

/**
 * Get user's RSVP for a specific event
 * GET /api/event-rsvp/:eventId
 */
export const getUserRsvp = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required." });
  }

  try {
    const rsvp = await prisma.event_rsvp.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      include: {
        UserProfile: {
          select: {
            userId: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!rsvp) {
      return res.status(404).json({ message: "RSVP not found." });
    }

    res.status(200).json({
      message: "RSVP retrieved successfully.",
      data: {
        id: rsvp.id,
        eventId: rsvp.eventId,
        userId: rsvp.userId,
        status: rsvp.status,
        createdAt: rsvp.createdAt,
        updatedAt: rsvp.updatedAt,
        user: rsvp.UserProfile,
      },
    });
  } catch (err) {
    console.error("Error fetching RSVP:", err);
    res.status(500).json({
      message: "Failed to fetch RSVP.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

/**
 * Delete user's RSVP for an event
 * DELETE /api/event-rsvp/:eventId
 */
export const deleteRsvp = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required." });
  }

  try {
    const rsvp = await prisma.event_rsvp.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!rsvp) {
      return res.status(404).json({ message: "RSVP not found." });
    }

    await prisma.event_rsvp.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    res.status(200).json({ message: "RSVP deleted successfully." });
  } catch (err) {
    console.error("Error deleting RSVP:", err);
    res.status(500).json({
      message: "Failed to delete RSVP.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

/**
 * Get all RSVPs for a specific event (attendees list)
 * GET /api/event-rsvp/event/:eventId/attendees
 */
export const getEventAttendees = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;
  const { status } = req.query; // Optional filter by status

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required." });
  }

  try {
    const where: any = { eventId };
    if (status && ['yes', 'maybe', 'no'].includes(status as string)) {
      where.status = status;
    }

    const rsvps = await prisma.event_rsvp.findMany({
      where,
      include: {
        UserProfile: {
          select: {
            userId: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const attendees = rsvps.map((rsvp: any) => ({
      id: rsvp.id,
      userId: rsvp.userId,
      status: rsvp.status,
      createdAt: rsvp.createdAt,
      username: rsvp.UserProfile.username,
      profilePicture: rsvp.UserProfile.profilePicture,
    }));

    // Count by status
    const counts = {
      yes: rsvps.filter((r: any) => r.status === 'yes').length,
      maybe: rsvps.filter((r: any) => r.status === 'maybe').length,
      no: rsvps.filter((r: any) => r.status === 'no').length,
      total: rsvps.length,
    };

    res.status(200).json({
      message: "Event attendees retrieved successfully.",
      data: {
        attendees,
        counts,
      },
    });
  } catch (err) {
    console.error("Error fetching event attendees:", err);
    res.status(500).json({
      message: "Failed to fetch event attendees.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

