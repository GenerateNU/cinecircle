import request from "supertest";
import express from "express";
import { createApp } from "../../app";
import { HTTP_STATUS } from "../helpers/constants.js";
import { prisma } from "../../services/db";

describe("Local Event API Tests", () => {
  let app: express.Express;

  const TEST_EVENTS = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Tony fan meetup",
      time: new Date("2025-10-09T18:30:00Z"),
      description: "Phillips referrals will NOT be handed out",
      genre: "Fan behavior",
      cost: 75.0,
      occasion: "123e4567-e89b-12d3-a456-4266",
      languages: ["English", "Hindi", "Viet"],
      lat: -5.03249234234,
      lon: 43.03242934,
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174000",
      title: "Coding Monkey Display",
      time: new Date("2025-10-10T14:00:00Z"),
      description: "They're gonna jump around",
      genre: "Education",
      cost: 0,
      occasion: null,
      languages: ["English", "monkey speak"],
      lat: 37.7749,
      lon: -122.4194,
    },
  ];

  beforeAll(async () => {
    app = createApp();
    await prisma.local_event.createMany({ data: TEST_EVENTS });
  });

  afterAll(async () => {
    await prisma.local_event.deleteMany({
      where: {
        id: { in: TEST_EVENTS.map((e) => e.id) },
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  // ────────────────────────────────────────────────
  // GET /local-event/:id
  // ────────────────────────────────────────────────
  describe("GET /local-event/:id", () => {
    it("should fetch the correct local event by ID", async () => {
      const eventId = TEST_EVENTS[0].id;

      const response = await request(app)
        .get(`/local-event/${eventId}`)
        .expect(HTTP_STATUS.OK)
        .expect("Content-Type", /json/);

      expect(response.body.message).toBe("Local event retrieved.");
      const event = response.body.data;
      expect(event.title).toBe("Tony fan meetup");
      expect(event.genre).toBe("Fan behavior");
    });

    it("should return 404 if the event does not exist", async () => {
      const response = await request(app)
        .get("/local-event/nonexistent-id")
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.message).toBe("Local event not found.");
    });

    it("should return 400 if the ID param is missing", async () => {
      const response = await request(app)
        .get("/local-event/")
        .expect(HTTP_STATUS.NOT_FOUND); // Express catches this as 404 (no route)
    });
  });

  // ────────────────────────────────────────────────
  // POST /local-event
  // ────────────────────────────────────────────────
  describe("POST /local-event", () => {
    it("should create a new local event successfully", async () => {
      const newEvent = {
        title: "Test Launch Party",
        time: new Date("2025-10-12T19:00:00Z").toISOString(),
        description: "Celebrate the new product launch",
        genre: "Business",
        languages: ["English"],
        occasion: "Launch",
        cost: 50,
        lat: 10.0,
        lon: 20.0,
      };

      const response = await request(app)
        .post("/local-event")
        .send(newEvent)
        .expect(HTTP_STATUS.CREATED);

      expect(response.body.message).toBe("Local event created.");
      expect(response.body.data.title).toBe("Test Launch Party");

      // cleanup
      await prisma.local_event.delete({
        where: { id: response.body.data.id },
      });
    });

    it("should return 400 for missing required fields", async () => {
      const invalidEvent = { title: "Missing fields" };

      const response = await request(app)
        .post("/local-event")
        .send(invalidEvent)
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.message).toBe("Missing required event fields.");
    });
  });

  // ────────────────────────────────────────────────
  // PUT /local-event/:id
  // ────────────────────────────────────────────────
  describe("PUT /local-event/:id", () => {
    it("should update an existing event’s title and cost", async () => {
      const eventId = TEST_EVENTS[1].id;

      const updatePayload = {
        title: "Coding Monkey Deluxe Display",
        cost: 25,
      };

      const response = await request(app)
        .put(`/local-event/${eventId}`)
        .send(updatePayload)
        .expect(HTTP_STATUS.OK);

      expect(response.body.message).toBe("Local event updated.");
      expect(response.body.data.title).toBe(updatePayload.title);
      expect(response.body.data.cost).toBe(updatePayload.cost);

      // Optional: revert data
      await prisma.local_event.update({
        where: { id: eventId },
        data: {
          title: "Coding Monkey Display",
          cost: 0,
        },
      });
    });

    it("should return 404 when updating a non-existent event", async () => {
      const response = await request(app)
        .put("/local-event/nonexistent-id")
        .send({ title: "Nothing" })
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.message).toBe("Local event not found.");
    });
  });

  // ────────────────────────────────────────────────
  // DELETE /local-event/:id
  // ────────────────────────────────────────────────
  describe("DELETE /local-event/:id", () => {
    it("should delete an existing event successfully", async () => {
      const event = await prisma.local_event.create({
        data: {
          title: "Disposable Event",
          time: new Date("2025-10-15T00:00:00Z"),
          description: "Temporary test event",
          genre: "Temp",
          languages: ["English"],
          occasion: "Unit tests",
          cost: 5,
          lat: 0,
          lon: 0,
        },
      });

      const response = await request(app)
        .delete(`/local-event/${event.id}`)
        .expect(HTTP_STATUS.OK);

      expect(response.body.message).toBe(
        "Local event deleted successfully."
      );

      const check = await prisma.local_event.findUnique({
        where: { id: event.id },
      });
      expect(check).toBeNull();
    });

    it("should return 404 when deleting a non-existent event", async () => {
      const response = await request(app)
        .delete("/local-event/non-existent-id")
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.message).toBe("Local event not found.");
    });
  });
});