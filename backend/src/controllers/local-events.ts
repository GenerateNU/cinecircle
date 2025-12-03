import type { Request, Response } from "express";
import { prisma } from "../services/db.js";
import { PrismaClient } from "@prisma/client";
import { reverseGeocode } from "../services/geocoding.js";

type LocalEvent = {
  id: string;
  title: string;
  time: Date;
  description: string;
  genre: string;
  languages: string[];
  occasion: string;
  cost: number;
  lat: number;
  lon: number;
  imageUrl: string | null;
};

export const getLocalEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Event ID is required." });

  try {
    const event = await prisma.local_event.findUnique({ 
      where: { id },
      include: {
        event_rsvp: {
          include: {
            UserProfile: {
              select: {
                userId: true,
                username: true,
                profilePicture: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    if (!event) return res.status(404).json({ message: "Local event not found." });

    const eventDate = event.time || new Date();
    const date = eventDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    const time = eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });

    // Format attendees (only 'yes' RSVPs)
    const attendees = event.event_rsvp
      .filter(rsvp => rsvp.status === 'yes')
      .map(rsvp => ({
        userId: rsvp.userId,
        username: rsvp.UserProfile.username,
        profilePicture: rsvp.UserProfile.profilePicture,
      }));

    // Count RSVPs by status
    const rsvpCounts = {
      yes: event.event_rsvp.filter(r => r.status === 'yes').length,
      maybe: event.event_rsvp.filter(r => r.status === 'maybe').length,
      no: event.event_rsvp.filter(r => r.status === 'no').length,
      total: event.event_rsvp.length,
    };

    const data = {
      id: event.id,
      title: event.title,
      location: await reverseGeocode(event.lat, event.lon),
      date,
      time,
      genre: event.genre,
      cost: event.cost,
      occasion: event.occasion,
      description: event.description,
      languages: event.languages,
      lat: event.lat,
      lon: event.lon,
      imageUrl: event.imageUrl,
      attendees,
      attendeeCount: attendees.length,
      rsvpCounts,
    };

    res.status(200).json({ message: "Local event retrieved.", data });
  } catch (err) {
    res.status(404).json({ message: "Local event not found." });
  }
};

export const createLocalEvent = async (req: Request, res: Response) => {
  const { title, time, description, genre, languages, cost, occasion, lat, lon, imageUrl } = req.body;

  if (
    !title ||
    !time ||
    !description ||
    !genre ||
    !languages ||
    cost == null ||
    !occasion ||
    lat == null ||
    lon == null
  ) {
    return res.status(400).json({ message: "Missing required event fields." });
  }

  try {
    const event = await prisma.local_event.create({
      data: {
        title,
        time: new Date(time),
        description,
        genre,
        languages,
        occasion,
        cost,
        lat,
        lon,
        imageUrl,
      },
    });

    res.status(201).json({
      message: "Local event created.",
      data: {
        id: event.id,
        title: event.title,
        time: event.time,
        description: event.description,
        genre: event.genre,
        languages: event.languages,
        occasion: event.occasion,
        cost: event.cost,
        lat: event.lat,
        lon: event.lon,
        imageUrl: event.imageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create local event.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const updateLocalEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, time, description, genre, languages, cost, occasion, lat, lon, imageUrl } = req.body;

  if (!id) return res.status(400).json({ message: "Event ID is required." });

  try {
    const existing = await prisma.local_event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Local event not found." });
    }

    const updated = await prisma.local_event.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        time: time ? new Date(time) : existing.time,
        description: description ?? existing.description,
        genre: genre ?? existing.genre,
        languages: languages ?? existing.languages,
        cost: cost ?? existing.cost,
        occasion: occasion ?? existing.occasion,
        lat: lat ?? existing.lat,
        lon: lon ?? existing.lon,
        imageUrl: imageUrl ?? existing.imageUrl,
      },
    });

    res.status(200).json({
      message: "Local event updated.",
      data: {
        id: updated.id,
        title: updated.title,
        time: updated.time,
        description: updated.description,
        genre: updated.genre,
        languages: updated.languages,
        cost: updated.cost,
        occasion: updated.occasion,
        lat: updated.lat,
        lon: updated.lon,
        imageUrl: updated.imageUrl,
      },
    });
  } catch (err) {
    res.status(404).json({ message: "Local event not found." });
  }
};

export const deleteLocalEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Event ID is required." });

  try {
    const existing = await prisma.local_event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Local event not found." });
    }

    await prisma.local_event.delete({ where: { id } });
    res.status(200).json({ message: "Local event deleted successfully." });
  } catch (err) {
    res.status(404).json({ message: "Local event not found." });
  }
};


export const getLocalEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.local_event.findMany({
      orderBy: { time: 'asc' }
    });

    const data = await Promise.all(events.map(async event => {
      const eventDate = event.time || new Date();
      const date = eventDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      const time = eventDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      });
      
      return {
        id: event.id,
        title: event.title,
        location: await reverseGeocode(event.lat, event.lon),
        date,
        time,
        genre: event.genre,
        cost: event.cost,
        occasion: event.occasion,
        description: event.description,
        languages: event.languages,
        lat: event.lat,
        lon: event.lon,
        imageUrl: event.imageUrl,
      };
    }));

    res.status(200).json({ message: "Local events retrieved.", data });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to retrieve local events.",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};