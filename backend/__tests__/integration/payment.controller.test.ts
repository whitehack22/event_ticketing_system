
import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { PaymentsTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as paymentService from "../../src/payments/payment.service";

let createdPaymentId: number;

const testPayment = {
 bookingID: 1,
 userID: 2,
 amount: "1000.00",
 paymentStatus: "Pending",
 paymentDate: "2025-07-05T14:08:10.296Z",
 paymentMethod: "Credit Card",
 transactionID: "AZ098669"
};

afterAll(async () => {
  if (createdPaymentId) {
    await db.delete(PaymentsTable).where(eq(PaymentsTable.paymentID, createdPaymentId));
  }
});

describe("Payment API Integration Tests", () => {
  // ----------------------------
  // CREATE
  // ----------------------------
  describe("POST /api/payment", () => {
    it("should create a payment", async () => {
      const res = await request(app).post("/api/payment").send(testPayment);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Payment created successfully");
      expect(res.body.payment).toHaveProperty("paymentID");

      createdPaymentId = res.body.payment.paymentID;
    });

    it("should return 400 if payment creation fails", async () => {
      jest.spyOn(paymentService, "createPayment").mockResolvedValue(null);

      const res = await request(app).post("/api/payment").send(testPayment);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Payment not created");

      (paymentService.createPayment as jest.Mock).mockRestore();
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(paymentService, "createPayment").mockImplementation(() => {
        throw new Error("Simulated createPayment error");
      });

      const res = await request(app).post("/api/payment").send(testPayment);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated createPayment error");

      (paymentService.createPayment as jest.Mock).mockRestore();
    });

    it("should return error for missing required fields", async () => {
      const res = await request(app).post("/api/payment").send({});
      expect([400, 500]).toContain(res.statusCode);
    });
  });

  // ----------------------------
  // READ - Get All Payments
  // ----------------------------
  describe("GET /api/payments", () => {
    it("should return all payments", async () => {
      const res = await request(app).get("/api/payments");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 500 if service fails", async () => {
      jest.spyOn(paymentService, "getAllPayments").mockImplementation(() => {
        throw new Error("Simulated getAllPayments error");
      });

      const res = await request(app).get("/api/payments");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getAllPayments error");

      (paymentService.getAllPayments as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // READ - Get Payment by ID
  // ----------------------------
  describe("GET /api/payment/:id", () => {
    it("should return a payment by ID", async () => {
      const res = await request(app).get(`/api/payment/${createdPaymentId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.paymentID).toBe(createdPaymentId);
    });

    it("should return 400 for invalid payment ID", async () => {
      const res = await request(app).get("/api/payment/not-a-number");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent payment", async () => {
      const res = await request(app).get("/api/payment/999999");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Payment not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(paymentService, "getPaymentById").mockImplementation(() => {
        throw new Error("Simulated getPaymentById error");
      });

      const res = await request(app).get("/api/payment/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getPaymentById error");

      (paymentService.getPaymentById as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // UPDATE
  // ----------------------------
  describe("PUT /api/payment/:id", () => {
    it("should update an existing payment", async () => {
      const updated = {
        amount: "1000.00",
        paymentStatus: "Completed"
      };

      const res = await request(app).put(`/api/payment/${createdPaymentId}`).send(updated);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Payment updated successfully");
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).put("/api/payment/invalid-id").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent payment", async () => {
      const res = await request(app).put("/api/payment/999999").send({ amount: "5000.00" });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Payment not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(paymentService, "updatePayment").mockImplementation(() => {
        throw new Error("Simulated updatePayment error");
      });

      const res = await request(app).put(`/api/payment/${createdPaymentId}`).send({});

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated updatePayment error");

      (paymentService.updatePayment as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // DELETE
  // ----------------------------
  describe("DELETE /api/payment/:id", () => {
    it("should delete a payment", async () => {
      const res = await request(app).delete(`/api/payment/${createdPaymentId}`);

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).delete("/api/payment/invalid-id");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should handle service failure with 500", async () => {
      jest.spyOn(paymentService, "deletePayment").mockImplementation(() => {
        throw new Error("Simulated deletePayment error");
      });

      const res = await request(app).delete("/api/payment/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated deletePayment error");

      (paymentService.deletePayment as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // GET PAYMENTS BY USER ID
  // ----------------------------
  describe("GET /api/payments/user/:userID", () => {
    it("should return payments for a valid user ID", async () => {
      const res = await request(app).get(`/api/payments/user/${testPayment.userID}`);

      expect([200, 404]).toContain(res.statusCode);

      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data)).toBe(true);
      } else {
        expect(res.body).toHaveProperty("message", "No payments found for this user.");
      }
    });

     it("should return 404 if user has no payments", async () => {
    jest
      .spyOn(paymentService, "getPaymentByUserId")
      .mockResolvedValueOnce([]); 

    const res = await request(app).get("/api/payments/user/99");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "No payments found for this user.");

    (paymentService.getPaymentByUserId as jest.Mock).mockRestore();
    });

    it("should return 400 for invalid user ID", async () => {
      const res = await request(app).get("/api/payments/user/not-a-number");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid user ID");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(paymentService, "getPaymentByUserId").mockImplementation(() => {
        throw new Error("Simulated service failure");
      });

      const res = await request(app).get("/api/payments/user/2");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated service failure");

      (paymentService.getPaymentByUserId as jest.Mock).mockRestore();
    });
  });
});
