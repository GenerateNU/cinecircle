import request from "supertest";
import express, { NextFunction } from "express";
import { createApp } from "../../app";
import { HTTP_STATUS } from "../helpers/constants.js";
import { prisma } from "../../services/db";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../../middleware/auth";

const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
const TEST_USER_ID_2 = "223e4567-e89b-12d3-a456-426614174000";
const TEST_EVENT_ID = "e1e11111-1111-1111-1111-111111111111";

jest.mock('../../middleware/auth', () => ({
  authenticateUser: (req: AuthenticatedRequest, res: any, next: NextFunction) => {
    // Use the userId from the authorization header if present, otherwise use default
    const authHeader = req.headers.authorization;
    if (authHeader?.includes('user2')) {
      req.user = {
        userId: TEST_USER_ID_2,
        id: TEST_USER_ID_2,
        email: 'testuser2@example.com',
        role: 'USER',
      };
    } else {
      req.user = {
        userId: TEST_USER_ID,
        id: TEST_USER_ID,
        email: 'testuser@example.com',
        role: 'USER',
      };
    }
    next();
  },
}));

describe("Event RSVP API Tests", () => {
  let app: express.Express;

  const generateToken = (userId: string = TEST_USER_ID) => {
    return jwt.sign(
      { userId, email: `${userId}@example.com`, role: "USER" },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );
  };

  const authHeader = (userId: string = TEST_USER_ID) => ({
    Authorization: `Bearer ${generateToken(userId)}`,
  });

  beforeAll(async () => {
    app = createApp();

    // Create test user profiles
    await prisma.userProfile.upsert({
      where: { userId: TEST_USER_ID },
      update: {},
      create: {
        userId: TEST_USER_ID,
        username: "testuser1",
        updatedAt: new Date(),
      },
    });

    await prisma.userProfile.upsert({
      where: { userId: TEST_USER_ID_2 },
      update: {},
      create: {
        userId: TEST_USER_ID_2,
        username: "testuser2",
        updatedAt: new Date(),
      },
    });

    // Create test event
    await prisma.local_event.create({
      data: {
        id: TEST_EVENT_ID,
        title: "Test RSVP Event",
        time: new Date("2025-12-31T18:00:00Z"),
        description: "Event for testing RSVPs",
        genre: "Test",
        cost: 25.0,
        occasion: "Testing",
        languages: ["English"],
        lat: 40.7128,
        lon: -74.0060,
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.event_rsvp.deleteMany({
      where: {
        eventId: TEST_EVENT_ID,
      },
    });
    await prisma.local_event.delete({
      where: { id: TEST_EVENT_ID },
    });
    await prisma.userProfile.deleteMany({
      where: { userId: { in: [TEST_USER_ID, TEST_USER_ID_2] } },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterEach(async () => {
    // Clean up RSVPs after each test
    await prisma.event_rsvp.deleteMany({
      where: {
        eventId: TEST_EVENT_ID,
      },
    });
  });

  // ────────────────────────────────────────────────
  // POST /api/event-rsvp - Create RSVP
  // ────────────────────────────────────────────────
  describe("POST /api/event-rsvp", () => {
    it("should create a new RSVP successfully", async () => {
      const rsvpData = {
        eventId: TEST_EVENT_ID,
        status: "yes",
      };

      const response = await request(app)
        .post("/api/event-rsvp")
        .set(authHeader())
        .send(rsvpData)
        .expect(HTTP_STATUS.OK);

      expect(response.body.message).toBe("RSVP saved successfully.");
      expect(response.body.data.eventId).toBe(TEST_EVENT_ID);
      expect(response.body.data.userId).toBe(TEST_USER_ID);
      expect(response.body.data.status).toBe("yes");
    });

    it("should update existing RSVP if user RSVPs again", async () => {
      // Create initial RSVP
      await request(app)
        .post("/api/event-rsvp")
        .set(authHeader())
        .send({ eventId: TEST_EVENT_ID, status: "yes" });

      // Update to 'maybe'
      const response = await request(app)
        .post("/api/event-rsvp")
        .set(authHeader())
        .send({ eventId: TEST_EVENT_ID, status: "maybe" })
        .expect(HTTP_STATUS.OK);

      expect(response.body.data.status).toBe("maybe");

      // Verify only one RSVP exists
      const rsvps = await prisma.event_rsvp.findMany({
        where: {
          eventId: TEST_EVENT_ID,
          userId: TEST_USER_ID,
        },
      });
      expect(rsvps.length).toBe(1);
    });

    it("should return 400 for invalid status", async () => {
      const response = await request(app)
        .post("/api/event-rsvp")
        .set(authHeader())
        .send({ eventId: TEST_EVENT_ID, status: "invalid" })
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.message).toBe("Status must be 'yes', 'maybe', or 'no'.");
    });

    it("should return 400 for missing eventId", async () => {
      const response = await request(app)
        .post("/api/event-rsvp")
        .set(authHeader())
        .send({ status: "yes" })
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.message).toBe("Event ID and status are required.");
    });

    it("should return 404 for non-existent event", async () => {
      const response = await request(app)
        .post("/api/event-rsvp")
        .set(authHeader())
        .send({ eventId: "99999999-9999-9999-9999-999999999999", status: "yes" })
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.message).toBe("Event not found.");
    });
  });

  // ────────────────────────────────────────────────
  // GET /api/event-rsvp/:eventId - Get User's RSVP
  // ────────────────────────────────────────────────
  describe("GET /api/event-rsvp/:eventId", () => {
    it("should retrieve user's RSVP for an event", async () => {
      // Create RSVP first
      await request(app)
        .post("/api/event-rsvp")
        .set(authHeader())
        .send({ eventId: TEST_EVENT_ID, status: "yes" });

      const response = await request(app)
        .get(`/api/event-rsvp/${TEST_EVENT_ID}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(response.body.message).toBe("RSVP retrieved successfully.");
      expect(response.body.data.status).toBe("yes");
      expect(response.body.data.userId).toBe(TEST_USER_ID);
    });

    it("should return 404 when user has no RSVP", async () => {
      const response = await request(app)
        .get(`/api/event-rsvp/${TEST_EVENT_ID}`)
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.message).toBe("RSVP not found.");
    });
  });

  // ────────────────────────────────────────────────
  // DELETE /api/event-rsvp/:eventId - Delete RSVP
  // ────────────────────────────────────────────────
  describe("DELETE /api/event-rsvp/:eventId", () => {
    it("should delete user's RSVP successfully", async () => {
      // Create RSVP first
      await request(app)
        .post("/api/event-rsvp")
        .set(authHeader())
        .send({ eventId: TEST_EVENT_ID, status: "yes" });

      const response = await request(app)
        .delete(`/api/event-rsvp/${TEST_EVENT_ID}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(response.body.message).toBe("RSVP deleted successfully.");

      // Verify it's deleted
      const rsvp = await prisma.event_rsvp.findUnique({
        where: {
          eventId_userId: {
            eventId: TEST_EVENT_ID,
            userId: TEST_USER_ID,
          },
        },
      });
      expect(rsvp).toBeNull();
    });

    it("should return 404 when deleting non-existent RSVP", async () => {
      const response = await request(app)
        .delete(`/api/event-rsvp/${TEST_EVENT_ID}`)
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.message).toBe("RSVP not found.");
    });
  });

  // ────────────────────────────────────────────────
  // GET /api/event-rsvp/event/:eventId/attendees
  // ────────────────────────────────────────────────
  describe("GET /api/event-rsvp/event/:eventId/attendees", () => {
    it("should retrieve all attendees for an event", async () => {
      // Create multiple RSVPs
      await request(app)
        .post("/api/event-rsvp")
        .set(authHeader(TEST_USER_ID))
        .send({ eventId: TEST_EVENT_ID, status: "yes" });

      await request(app)
        .post("/api/event-rsvp")
        .set({ Authorization: `Bearer user2` })
        .send({ eventId: TEST_EVENT_ID, status: "maybe" });

      const response = await request(app)
        .get(`/api/event-rsvp/event/${TEST_EVENT_ID}/attendees`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(response.body.message).toBe("Event attendees retrieved successfully.");
      expect(response.body.data.attendees.length).toBe(2);
      expect(response.body.data.counts.yes).toBe(1);
      expect(response.body.data.counts.maybe).toBe(1);
      expect(response.body.data.counts.total).toBe(2);
    });

    it("should filter attendees by status", async () => {
      // Create RSVPs with different statuses
      await request(app)
        .post("/api/event-rsvp")
        .set(authHeader(TEST_USER_ID))
        .send({ eventId: TEST_EVENT_ID, status: "yes" });

      await request(app)
        .post("/api/event-rsvp")
        .set({ Authorization: `Bearer user2` })
        .send({ eventId: TEST_EVENT_ID, status: "no" });

      const response = await request(app)
        .get(`/api/event-rsvp/event/${TEST_EVENT_ID}/attendees?status=yes`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(response.body.data.attendees.length).toBe(1);
      expect(response.body.data.attendees[0].status).toBe("yes");
    });

    it("should return empty array when event has no RSVPs", async () => {
      const response = await request(app)
        .get(`/api/event-rsvp/event/${TEST_EVENT_ID}/attendees`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(response.body.data.attendees.length).toBe(0);
      expect(response.body.data.counts.total).toBe(0);
    });
  });

  // ────────────────────────────────────────────────
  // GET /api/local-event/:id - Event with attendees
  // ────────────────────────────────────────────────
  describe("GET /api/local-event/:id - includes attendees", () => {
    it("should include attendees in event response", async () => {
      // Create RSVPs
      await request(app)
        .post("/api/event-rsvp")
        .set(authHeader(TEST_USER_ID))
        .send({ eventId: TEST_EVENT_ID, status: "yes" });

      await request(app)
        .post("/api/event-rsvp")
        .set({ Authorization: `Bearer user2` })
        .send({ eventId: TEST_EVENT_ID, status: "yes" });

      const response = await request(app)
        .get(`/api/local-event/${TEST_EVENT_ID}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(response.body.data.attendees).toBeDefined();
      expect(response.body.data.attendees.length).toBe(2);
      expect(response.body.data.attendeeCount).toBe(2);
    });

    it("should only include 'yes' RSVPs in attendees", async () => {
      // Create different RSVP statuses
      await request(app)
        .post("/api/event-rsvp")
        .set(authHeader(TEST_USER_ID))
        .send({ eventId: TEST_EVENT_ID, status: "yes" });

      await request(app)
        .post("/api/event-rsvp")
        .set({ Authorization: `Bearer user2` })
        .send({ eventId: TEST_EVENT_ID, status: "maybe" });

      const response = await request(app)
        .get(`/api/local-event/${TEST_EVENT_ID}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      // Only 'yes' RSVPs should be in attendees
      expect(response.body.data.attendees.length).toBe(1);
      expect(response.body.data.attendeeCount).toBe(1);
    });
  });
});

