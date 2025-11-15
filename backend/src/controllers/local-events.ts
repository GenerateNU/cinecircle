import type { Request, Response } from "express";
import { prisma } from "../services/db.js";
import { PrismaClient } from "@prisma/client";

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
};

export const getLocalEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Event ID is required." });

  try {
    const event = await prisma.local_event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ message: "Local event not found." });

    const data: LocalEvent = {
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
    };

    res.status(200).json({ message: "Local event retrieved.", data });
  } catch (err) {
    res.status(404).json({ message: "Local event not found." });
  }
};

export const createLocalEvent = async (req: Request, res: Response) => {
  const { title, time, description, genre, languages, cost, occasion, lat, lon } = req.body;

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
  const { title, time, description, genre, languages, cost, occasion, lat, lon } = req.body;

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