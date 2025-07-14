import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { CustomerSupportTicketsTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as supportTicketService from "../../src/customer_support/support.service";

let createdTicketId: number;

const testTicket = {
  userID: 4,
  subject: "Change of venue timetable",
  description: "I would like to request for a change in venue arrival."

};

afterAll(async () => {
  if (createdTicketId) {
    await db.delete(CustomerSupportTicketsTable).where(eq(CustomerSupportTicketsTable.ticketID, createdTicketId));
  }
});

describe("Customer Support Ticket API Integration Tests", () => {
  // ----------------------------
  // CREATE
  // ----------------------------
  describe("POST /api/ticket", () => {
    it("should create a ticket", async () => {
      const res = await request(app).post("/api/ticket").send(testTicket);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Support Ticket created successfully");
      expect(res.body.supportTicket).toHaveProperty("ticketID");

      // console.log("Response body:", res.body);

      createdTicketId = res.body.supportTicket.ticketID;
    });

    it("should return 400 if ticket creation fails", async () => {
      jest.spyOn(supportTicketService, "createSupportTicket").mockResolvedValue(null);

      const res = await request(app).post("/api/ticket").send(testTicket);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Support Ticket not created");

      (supportTicketService.createSupportTicket as jest.Mock).mockRestore();
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(supportTicketService, "createSupportTicket").mockImplementation(() => {
        throw new Error("Simulated createSupportTicket error");
      });

      const res = await request(app).post("/api/ticket").send(testTicket);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated createSupportTicket error");

      (supportTicketService.createSupportTicket as jest.Mock).mockRestore();
    });

    it("should return error for missing required fields", async () => {
      const res = await request(app).post("/api/ticket").send({});
      expect([400, 500]).toContain(res.statusCode);
    });
  });

  // ----------------------------
  // READ - Get All Tickets
  // ----------------------------
  describe("GET /api/tickets", () => {
    it("should return all tickets", async () => {
      const res = await request(app).get("/api/tickets");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 500 if service fails", async () => {
      jest.spyOn(supportTicketService, "getAllSupportTickets").mockImplementation(() => {
        throw new Error("Simulated getAllSupportTickets error");
      });

      const res = await request(app).get("/api/tickets");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getAllSupportTickets error");

      (supportTicketService.getAllSupportTickets as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // READ - Get Ticket by ID
  // ----------------------------
  describe("GET /api/ticket/:id", () => {
    it("should return a ticket by ID", async () => {
      const res = await request(app).get(`/api/ticket/${createdTicketId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.ticketID).toBe(createdTicketId);
    });

    it("should return 400 for invalid ticket ID", async () => {
      const res = await request(app).get("/api/ticket/not-a-number");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent ticket", async () => {
      const res = await request(app).get("/api/ticket/999999");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Support ticket not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(supportTicketService, "getSupportTicketById").mockImplementation(() => {
        throw new Error("Simulated getSupportTicketById error");
      });

      const res = await request(app).get("/api/ticket/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getSupportTicketById error");

      (supportTicketService.getSupportTicketById as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // UPDATE
  // ----------------------------
  describe("PUT /api/ticket/:id", () => {
    it("should update an existing ticket", async () => {
      const updated = {
        subject: "Cannot edit profile",
        description: "I am unable to edit my profile picture. Kindly assist"
      };

      const res = await request(app).put(`/api/ticket/${createdTicketId}`).send(updated);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Support Ticket updated successfully");
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).put("/api/ticket/invalid-id").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent ticket", async () => {
      const res = await request(app).put("/api/ticket/999999").send({  subject: "Cannot edit booking" });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Support Ticket not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(supportTicketService, "updateSupportTicket").mockImplementation(() => {
        throw new Error("Simulated updateSupportTicket error");
      });

      const res = await request(app).put(`/api/ticket/${createdTicketId}`).send({});

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated updateSupportTicket error");

      (supportTicketService.updateSupportTicket as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // DELETE
  // ----------------------------
  describe("DELETE /api/ticket/:id", () => {
    it("should delete a ticket", async () => {
      const res = await request(app).delete(`/api/ticket/${createdTicketId}`);

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).delete("/api/ticket/invalid-id");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should handle service failure with 500", async () => {
      jest.spyOn(supportTicketService, "deleteSupportTicket").mockImplementation(() => {
        throw new Error("Simulated deleteSupportTicket error");
      });

      const res = await request(app).delete("/api/ticket/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated deleteSupportTicket error");

      (supportTicketService.deleteSupportTicket as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // GET TICKETS BY USER ID
  // ----------------------------
  describe("GET /api/tickets/user/:userID", () => {
    it("should return tickets for a valid user ID", async () => {
      const res = await request(app).get(`/api/tickets/user/${testTicket.userID}`);

      expect([200, 404]).toContain(res.statusCode);

      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data)).toBe(true);
      } else {
        expect(res.body).toHaveProperty("message", "No support tickets found for this user.");
      }
    });

     it("should return 404 if user has no tickets", async () => {
    jest
      .spyOn(supportTicketService, "getSupportTicketByUserId")
      .mockResolvedValueOnce([]); 

    const res = await request(app).get("/api/tickets/user/99");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "No support tickets found for this user.");

    (supportTicketService.getSupportTicketByUserId as jest.Mock).mockRestore();
    });

    it("should return 400 for invalid user ID", async () => {
      const res = await request(app).get("/api/tickets/user/not-a-number");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid user ID");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(supportTicketService, "getSupportTicketByUserId").mockImplementation(() => {
        throw new Error("Simulated service failure");
      });

      const res = await request(app).get("/api/tickets/user/2");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated service failure");

      (supportTicketService.getSupportTicketByUserId as jest.Mock).mockRestore();
    });
  });
});
