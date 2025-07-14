// __tests__/integration/booking.controller.test.ts

jest.mock("../../src/middleware/bearAuth", () => ({
  adminRoleAuth: (_req: any, _res: any, next: any) => next(),
  userRoleAuth: (_req: any, _res: any, next: any) => next(),
}));


import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { BookingsTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as bookingService from "../../src/bookings/booking.service";

let createdBookingId: number;

const testBooking = {
  userID: 2,
  eventID: 1,
  numberOfTickets: 5,
  totalAmount: "500.00",
  bookingStatus: "Confirmed"
};

afterAll(async () => {
  if (createdBookingId) {
    await db.delete(BookingsTable).where(eq(BookingsTable.bookingID, createdBookingId));
  }
});

describe("Booking API Integration Tests", () => {
  // ----------------------------
  // CREATE
  // ----------------------------
  describe("POST /api/booking", () => {
    it("should create a booking", async () => {
      const res = await request(app).post("/api/booking").send(testBooking);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Booking created successfully");
      expect(res.body.booking).toHaveProperty("bookingID");

      createdBookingId = res.body.booking.bookingID;
    });

    it("should return 400 if booking creation fails", async () => {
      jest.spyOn(bookingService, "createBooking").mockResolvedValue(null);

      const res = await request(app).post("/api/booking").send(testBooking);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Booking not created");

      (bookingService.createBooking as jest.Mock).mockRestore();
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(bookingService, "createBooking").mockImplementation(() => {
        throw new Error("Simulated createBooking error");
      });

      const res = await request(app).post("/api/booking").send(testBooking);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated createBooking error");

      (bookingService.createBooking as jest.Mock).mockRestore();
    });

    it("should return error for missing required fields", async () => {
      const res = await request(app).post("/api/booking").send({});
      expect([400, 500]).toContain(res.statusCode);
    });
  });

  // ----------------------------
  // READ - Get All Bookings
  // ----------------------------
  describe("GET /api/bookings", () => {
    it("should return all bookings", async () => {
      const res = await request(app).get("/api/bookings");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 500 if service fails", async () => {
      jest.spyOn(bookingService, "getAllBookings").mockImplementation(() => {
        throw new Error("Simulated getAllBookings error");
      });

      const res = await request(app).get("/api/bookings");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getAllBookings error");

      (bookingService.getAllBookings as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // READ - Get Booking by ID
  // ----------------------------
  describe("GET /api/booking/:id", () => {
    it("should return a booking by ID", async () => {
      const res = await request(app).get(`/api/booking/${createdBookingId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.bookingID).toBe(createdBookingId);
    });

    it("should return 400 for invalid booking ID", async () => {
      const res = await request(app).get("/api/booking/not-a-number");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent booking", async () => {
      const res = await request(app).get("/api/booking/999999");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Booking not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(bookingService, "getBookingById").mockImplementation(() => {
        throw new Error("Simulated getBookingById error");
      });

      const res = await request(app).get("/api/booking/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getBookingById error");

      (bookingService.getBookingById as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // UPDATE
  // ----------------------------
  describe("PUT /api/booking/:id", () => {
    it("should update an existing booking", async () => {
      const updated = {
        numberOfTickets: 3,
        totalAmount: "750.00"
      };

      const res = await request(app).put(`/api/booking/${createdBookingId}`).send(updated);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Booking updated successfully");
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).put("/api/booking/invalid-id").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent booking", async () => {
      const res = await request(app).put("/api/booking/999999").send({ numberOfTickets: 1 });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Booking not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(bookingService, "updateBooking").mockImplementation(() => {
        throw new Error("Simulated updateBooking error");
      });

      const res = await request(app).put(`/api/booking/${createdBookingId}`).send({});

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated updateBooking error");

      (bookingService.updateBooking as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // DELETE
  // ----------------------------
  describe("DELETE /api/booking/:id", () => {
    it("should delete a booking", async () => {
      const res = await request(app).delete(`/api/booking/${createdBookingId}`);

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).delete("/api/booking/invalid-id");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should handle service failure with 500", async () => {
      jest.spyOn(bookingService, "deleteBooking").mockImplementation(() => {
        throw new Error("Simulated deleteBooking error");
      });

      const res = await request(app).delete("/api/booking/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated deleteBooking error");

      (bookingService.deleteBooking as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // GET BOOKINGS BY USER ID
  // ----------------------------
  describe("GET /api/bookings/user/:userID", () => {
    it("should return bookings for a valid user ID", async () => {
      const res = await request(app).get(`/api/bookings/user/${testBooking.userID}`);

      expect([200, 404]).toContain(res.statusCode);

      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data)).toBe(true);
      } else {
        expect(res.body).toHaveProperty("message", "No bookings found for this user.");
      }
    });

     it("should return 404 if user has no bookings", async () => {
    jest
      .spyOn(bookingService, "getBookingsByUserId")
      .mockResolvedValueOnce([]); 

    const res = await request(app).get("/api/bookings/user/99");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "No bookings found for this user.");

    (bookingService.getBookingsByUserId as jest.Mock).mockRestore();
    });

    it("should return 400 for invalid user ID", async () => {
      const res = await request(app).get("/api/bookings/user/not-a-number");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid user ID");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(bookingService, "getBookingsByUserId").mockImplementation(() => {
        throw new Error("Simulated service failure");
      });

      const res = await request(app).get("/api/bookings/user/2");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated service failure");

      (bookingService.getBookingsByUserId as jest.Mock).mockRestore();
    });
  });
});
