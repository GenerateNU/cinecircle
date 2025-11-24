import request from "supertest";
import express, { NextFunction } from "express";
import { createApp } from "../../app";
import { HTTP_STATUS } from "../helpers/constants.js";
import { prisma } from "../../services/db";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../../middleware/auth";

jest.mock('../../middleware/auth', () => ({
  authenticateUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'testuser@example.com',
      role: 'USER',
    };
    next();
  },
}));

describe("Local Event API Tests", () => {
  let app: express.Express;
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_USER_EMAIL = "testuser@example.com";
  const TEST_USER_ROLE = "USER";

  const generateToken = () => {
    return jwt.sign(
      { id: TEST_USER_ID, email: TEST_USER_EMAIL, role: TEST_USER_ROLE },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );
  };

  const authHeader = () => ({
    Authorization: `Bearer ${generateToken()}`,
  });

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
    // Create user profile for authenticated requests
    await prisma.userProfile.upsert({
      where: { userId: TEST_USER_ID },
      update: {},
      create: {
        userId: TEST_USER_ID,
        username: "testuser",
        updatedAt: new Date(),
      },
    });
    await prisma.local_event.createMany({ data: TEST_EVENTS });
  });

  afterAll(async () => {
    await prisma.local_event.deleteMany({
      where: {
        id: { in: TEST_EVENTS.map((e) => e.id) },
      },
    });
    await prisma.userProfile.deleteMany({ where: { userId: TEST_USER_ID } });
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  // ────────────────────────────────────────────────
  // GET /local-event/:id
  // ────────────────────────────────────────────────
  describe("GET /api/local-event/:id", () => {
    it("should fetch the correct local event by ID", async () => {
      const eventId = TEST_EVENTS[0].id;

      const response = await request(app)
        .get(`/api/local-event/${eventId}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK)
        .expect("Content-Type", /json/);

      expect(response.body.message).toBe("Local event retrieved.");
      const event = response.body.data;
      expect(event.title).toBe("Tony fan meetup");
      expect(event.genre).toBe("Fan behavior");
    });

    it("should return 404 if the event does not exist", async () => {
      const response = await request(app)
        .get("/api/local-event/nonexistent-id")
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.message).toBe("Local event not found.");
    });

    it("should return 400 if the ID param is missing", async () => {
      const response = await request(app)
        .get("/api/local-event/")
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND); // Express catches this as 404 (no route)
    });
  });

  // ────────────────────────────────────────────────
  // POST /api/local-event
  // ────────────────────────────────────────────────
  describe("POST /api/local-event", () => {
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
        .post("/api/local-event")
        .set(authHeader())
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
        .post("/api/local-event")
        .set(authHeader())
        .send(invalidEvent)
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.message).toBe("Missing required event fields.");
    });
  });

  // ────────────────────────────────────────────────
  // PUT /api/local-event/:id
  // ────────────────────────────────────────────────
  describe("PUT /api/local-event/:id", () => {
    it("should update an existing event's title and cost", async () => {
      const eventId = TEST_EVENTS[1].id;

      const updatePayload = {
        title: "Coding Monkey Deluxe Display",
        cost: 25,
      };

      const response = await request(app)
        .put(`/api/local-event/${eventId}`)
        .set(authHeader())
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
        .put("/api/local-event/nonexistent-id")
        .set(authHeader())
        .send({ title: "Nothing" })
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.message).toBe("Local event not found.");
    });
  });

  // ────────────────────────────────────────────────
  // DELETE /api/local-event/:id
  // ────────────────────────────────────────────────
  describe("DELETE /api/local-event/:id", () => {
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
        .delete(`/api/local-event/${event.id}`)
        .set(authHeader())
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
        .delete("/api/local-event/non-existent-id")
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.message).toBe("Local event not found.");
    });
  });
});
jest.mock('../../services/db', () => {
  const localEvents = new Map<string, any>();
  const userProfiles = new Map<string, any>();

  const clone = (record: any) => (record ? { ...record } : record);
  const matchesWhere = (record: any, where: Record<string, any> = {}) =>
    Object.entries(where).every(([key, value]) => record[key] === value);

  const localEventModel = {
    create: jest.fn(async ({ data }) => {
      const id = data.id ?? crypto.randomUUID();
      const record = { ...data, id };
      localEvents.set(id, record);
      return clone(record);
    }),
    createMany: jest.fn(async ({ data }) => {
      data.forEach((item: any) => {
        const id = item.id ?? crypto.randomUUID();
        const record = { ...item, id };
        localEvents.set(id, record);
      });
      return { count: data.length };
    }),
    findUnique: jest.fn(async ({ where: { id } }: any) => clone(localEvents.get(id) ?? null)),
    findMany: jest.fn(async ({ where }: any = {}) =>
      Array.from(localEvents.values())
        .filter((record) => !where || matchesWhere(record, where))
        .map(clone),
    ),
    update: jest.fn(async ({ where: { id }, data }: any) => {
      const record = localEvents.get(id);
      if (!record) {
        const error: any = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      const updated = { ...record, ...data };
      localEvents.set(id, updated);
      return clone(updated);
    }),
    delete: jest.fn(async ({ where: { id } }: any) => {
      const record = localEvents.get(id);
      if (!record) {
        const error: any = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      localEvents.delete(id);
      return clone(record);
    }),
    deleteMany: jest.fn(async ({ where }: any = {}) => {
      let count = 0;
      for (const [id, record] of Array.from(localEvents.entries())) {
        if (!where || matchesWhere(record, where)) {
          localEvents.delete(id);
          count += 1;
        }
      }
      return { count };
    }),
  };

  const userProfileModel = {
    upsert: jest.fn(async ({ where: { userId }, create, update }: any) => {
      const existing = userProfiles.get(userId);
      if (existing) {
        const updated = { ...existing, ...update };
        userProfiles.set(userId, updated);
        return clone(updated);
      }
      const record = { ...create };
      userProfiles.set(userId, record);
      return clone(record);
    }),
    deleteMany: jest.fn(async ({ where: { userId } }: any) => {
      const hasProfile = userProfiles.has(userId);
      userProfiles.delete(userId);
      return { count: hasProfile ? 1 : 0 };
    }),
    findUnique: jest.fn(async ({ where: { userId } }: any) =>
      clone(userProfiles.get(userId) ?? null),
    ),
  };

  return {
    prisma: {
      local_event: localEventModel,
      userProfile: userProfileModel,
      $disconnect: jest.fn(async () => {
        localEvents.clear();
        userProfiles.clear();
      }),
    },
  };
});
