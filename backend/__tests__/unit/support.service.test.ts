import {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  deleteSupportTicket,
  getSupportTicketByUserId,
} from "../../src/customer_support/support.service";
import db from "../../src/Drizzle/db";
import { CustomerSupportTicketsTable } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    CustomerSupportTicketsTable: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Customer Support Tickets Service", () => {
  describe("createSupportTicket", () => {
    it("should insert a ticket and return the inserted ticket", async () => {
      const ticket = {
        userID: 2,
        subject: "Change of venue timetable",
        description: "I would like to request for a change in venue arrival.",
        status: "Open"
      };

      const inserted = {
        ticketID: 1,
        ...ticket,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([inserted]),
        }),
      });

      const result = await createSupportTicket(ticket as any);
      expect(db.insert).toHaveBeenCalledWith(CustomerSupportTicketsTable);
      expect(result).toEqual(inserted);
    });

    it("should return null if insertion fails", async () => {
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([null]),
        }),
      });

      const result = await createSupportTicket({
        userID: 2,
        subject: "Change of venue timetable",
        description: "I would like to request for a change in venue arrival.",
        status: "Open"
      } as any);

      expect(result).toBeNull();
    });
  });

  describe("getAllSupportTickets", () => {
    it("should return all tickets", async () => {
      const tickets = [
        {
          ticketID: 1,
          userID: 2,
          subject: "Change of venue timetable",
          description: "I would like to request for a change in venue arrival.",
          status: "Open",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (db.query.CustomerSupportTicketsTable.findMany as jest.Mock).mockResolvedValueOnce(tickets);

      const result = await getAllSupportTickets();
      expect(result).toEqual(tickets);
    });

    it("should return empty array if no tickets exist", async () => {
      (db.query.CustomerSupportTicketsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getAllSupportTickets();
      expect(result).toEqual([]);
    });
  });

  describe("getSupportTicketById", () => {
    it("should return a ticket if found", async () => {
      const ticket = {
        ticketID: 1,
        userID: 2,
        subject: "Change of venue timetable",
        description: "I would like to request for a change in venue arrival.",
        status: "Open",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.query.CustomerSupportTicketsTable.findFirst as jest.Mock).mockResolvedValueOnce(ticket);

      const result = await getSupportTicketById(1);
      expect(result).toEqual(ticket);
    });

    it("should return undefined if ticket is not found", async () => {
      (db.query.CustomerSupportTicketsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getSupportTicketById(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updateSupportTicket", () => {
    it("should update a ticket and return the updated object", async () => {
      const updatedticket = {
        ticketID: 1,
        userID: 2,
        subject: "Change of venue personnel",
        description: "I would like to request for a change in personnel working at the venue.",
        status: "Open",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([updatedticket]),
          }),
        }),
      });

      const result = await updateSupportTicket(1, updatedticket as any);
      expect(db.update).toHaveBeenCalledWith(CustomerSupportTicketsTable);
      expect(result).toEqual(updatedticket);
    });

    it("should return null if no ticket was updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([]),
          }),
        }),
      });

      const result = await updateSupportTicket(1, {} as any);
      expect(result).toBeNull();
    });
  });

  describe("deleteSupportTicket", () => {
    it("should delete a ticket and return success message", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(undefined),
      });

      const result = await deleteSupportTicket(1);
      expect(db.delete).toHaveBeenCalledWith(CustomerSupportTicketsTable);
      expect(result).toBe("Support ticket deleted successfully");
    });
  });

  describe("getSupportTicketsByUserId", () => {
    it("should return tickets for a specific user", async () => {
      const userSupportTickets = [
        {
          ticketID: 1,
          userID: 2,
          subject: "Change of venue personnel",
          description: "I would like to request for a change in personnel working at the venue.",
          status: "Open",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (db.query.CustomerSupportTicketsTable.findMany as jest.Mock).mockResolvedValueOnce(userSupportTickets);

      const result = await getSupportTicketByUserId(2);
      expect(result).toEqual(userSupportTickets);
    });

    it("should return empty array if user has no tickets", async () => {
      (db.query.CustomerSupportTicketsTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getSupportTicketByUserId(10);
      expect(result).toEqual([]);
    });
  });
});
