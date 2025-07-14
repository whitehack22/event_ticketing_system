import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { EventsTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as eventService from "../../src/events/event.service";

let createdEventId: number;

const testEvent = {
  title: "Christmas Festival 2025",
  description: "Welcome to Christmas Festivals at Uhuru Park in Nairobi",
  category: "Festivals",
  eventDate: "2025-08-15",
  startTime: "2025-08-15T09:00:00.000Z",
  endTime: "2025-08-15T17:00:00.000Z",
  ticketPrice: 100.00,
  totalTickets: 400,
  availableTickets: 250,
  venueID: 1
};

afterAll(async () => {
  if (createdEventId) {
    await db.delete(EventsTable).where(eq(EventsTable.eventID, createdEventId));
  }
});

describe("Event API Integration Tests", () => {
  // ----------------------------
  // CREATE
  // ----------------------------
  describe("POST /api/event", () => {
    it("should create a event", async () => {
      const res = await request(app).post("/api/event").send(testEvent);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Event created successfully");
      expect(res.body.event).toHaveProperty("eventID");

      createdEventId = res.body.event.eventID;
    });

    it("should return 400 if event creation fails", async () => {
      jest.spyOn(eventService, "createEvent").mockResolvedValue(null);

      const res = await request(app).post("/api/event").send(testEvent);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Event not created");

      (eventService.createEvent as jest.Mock).mockRestore();
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(eventService, "createEvent").mockImplementation(() => {
        throw new Error("Simulated createEvent error");
      });

      const res = await request(app).post("/api/event").send(testEvent);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated createEvent error");

      (eventService.createEvent as jest.Mock).mockRestore();
    });

    it("should return error for missing required fields", async () => {
      const res = await request(app).post("/api/event").send({});
      expect([400, 500]).toContain(res.statusCode);
    });
  });

  // ----------------------------
  // READ - Get All Events
  // ----------------------------
  describe("GET /api/events", () => {
    it("should return all events", async () => {
      const res = await request(app).get("/api/events");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 500 if service fails", async () => {
      jest.spyOn(eventService, "getAllEvents").mockImplementation(() => {
        throw new Error("Simulated getAllEvents error");
      });

      const res = await request(app).get("/api/events");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getAllEvents error");

      (eventService.getAllEvents as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // READ - Get Event by ID
  // ----------------------------
  describe("GET /api/event/:id", () => {
    it("should return a event by ID", async () => {
      const res = await request(app).get(`/api/event/${createdEventId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.eventID).toBe(createdEventId);
    });

    it("should return 400 for invalid event ID", async () => {
      const res = await request(app).get("/api/event/not-a-number");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent event", async () => {
      const res = await request(app).get("/api/event/999999");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Event not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(eventService, "getEventById").mockImplementation(() => {
        throw new Error("Simulated getEventById error");
      });

      const res = await request(app).get("/api/event/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getEventById error");

      (eventService.getEventById as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // UPDATE
  // ----------------------------
  describe("PUT /api/event/:id", () => {
    it("should update an existing event", async () => {
      const updated = {
         description: "Welcome to Bull Riding Event in Kitale",
         category: "Festivals"
      };

      const res = await request(app).put(`/api/event/${createdEventId}`).send(updated);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Event updated successfully");
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).put("/api/event/invalid-id").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent event", async () => {
      const res = await request(app).put("/api/event/999999").send({ category: "Sports" });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Event not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(eventService, "updateEvent").mockImplementation(() => {
        throw new Error("Simulated updateEvent error");
      });

      const res = await request(app).put(`/api/event/${createdEventId}`).send({});

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated updateEvent error");

      (eventService.updateEvent as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // DELETE
  // ----------------------------
  describe("DELETE /api/event/:id", () => {
    it("should delete a event", async () => {
      const res = await request(app).delete(`/api/event/${createdEventId}`);

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).delete("/api/event/invalid-id");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should handle service failure with 500", async () => {
      jest.spyOn(eventService, "deleteEvent").mockImplementation(() => {
        throw new Error("Simulated deleteEvent error");
      });

      const res = await request(app).delete("/api/event/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated deleteEvent error");

      (eventService.deleteEvent as jest.Mock).mockRestore();
    });
  });
});
