import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { VenuesTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as venueService from "../../src/venues/venue.service";

let createdVenueId: number;

const testVenue = {
   name: "Aberdare National Park",
   address: "123 Nyeri",
   capacity: 500,
   contactNumber: "0722311455",
   createdAt: "2025-07-03T15:41:17.045Z"
};

afterAll(async () => {
  if (createdVenueId) {
    await db.delete(VenuesTable).where(eq(VenuesTable.venueID, createdVenueId));
  }
});

describe("Venue API Integration Tests", () => {
  // ----------------------------
  // CREATE
  // ----------------------------
  describe("POST /api/venue", () => {
    it("should create a venue", async () => {
      const res = await request(app).post("/api/venue").send(testVenue);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Venue created successfully");
      expect(res.body.venue).toHaveProperty("venueID");

      createdVenueId = res.body.venue.venueID;
    });

    it("should return 400 if venue creation fails", async () => {
      jest.spyOn(venueService, "createVenue").mockResolvedValue(null);

      const res = await request(app).post("/api/venue").send(testVenue);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Venue not created");

      (venueService.createVenue as jest.Mock).mockRestore();
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(venueService, "createVenue").mockImplementation(() => {
        throw new Error("Simulated createVenue error");
      });

      const res = await request(app).post("/api/venue").send(testVenue);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated createVenue error");

      (venueService.createVenue as jest.Mock).mockRestore();
    });

    it("should return error for missing required fields", async () => {
      const res = await request(app).post("/api/venue").send({});
      expect([400, 500]).toContain(res.statusCode);
    });
  });

  // ----------------------------
  // READ - Get All Venues
  // ----------------------------
  describe("GET /api/venues", () => {
    it("should return all venues", async () => {
      const res = await request(app).get("/api/venues");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 500 if service fails", async () => {
      jest.spyOn(venueService, "getAllVenues").mockImplementation(() => {
        throw new Error("Simulated getAllVenues error");
      });

      const res = await request(app).get("/api/venues");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getAllVenues error");

      (venueService.getAllVenues as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // READ - Get Venue by ID
  // ----------------------------
  describe("GET /api/venue/:id", () => {
    it("should return a venue by ID", async () => {
      const res = await request(app).get(`/api/venue/${createdVenueId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.venueID).toBe(createdVenueId);
    });

    it("should return 400 for invalid venue ID", async () => {
      const res = await request(app).get("/api/venue/not-a-number");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent venue", async () => {
      const res = await request(app).get("/api/venue/999999");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Venue not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(venueService, "getVenueById").mockImplementation(() => {
        throw new Error("Simulated getVenueById error");
      });

      const res = await request(app).get("/api/venue/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getVenueById error");

      (venueService.getVenueById as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // UPDATE
  // ----------------------------
  describe("PUT /api/venue/:id", () => {
    it("should update an existing venue", async () => {
      const updated = {
         name: "SportManArms Nanyuki",
         address: "202 Nanyuki"
      };

      const res = await request(app).put(`/api/venue/${createdVenueId}`).send(updated);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Venue updated successfully");
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).put("/api/venue/invalid-id").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent venue", async () => {
      const res = await request(app).put("/api/venue/999999").send({ address: "202 Meru" });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Venue not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(venueService, "updateVenue").mockImplementation(() => {
        throw new Error("Simulated updateVenue error");
      });

      const res = await request(app).put(`/api/venue/${createdVenueId}`).send({});

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated updateVenue error");

      (venueService.updateVenue as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // DELETE
  // ----------------------------
  describe("DELETE /api/venue/:id", () => {
    it("should delete a venue", async () => {
      const res = await request(app).delete(`/api/venue/${createdVenueId}`);

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).delete("/api/venue/invalid-id");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should handle service failure with 500", async () => {
      jest.spyOn(venueService, "deleteVenue").mockImplementation(() => {
        throw new Error("Simulated deleteVenue error");
      });

      const res = await request(app).delete("/api/venue/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated deleteVenue error");

      (venueService.deleteVenue as jest.Mock).mockRestore();
    });
  });
});
