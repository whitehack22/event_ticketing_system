import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../../src/events/event.service";
import db from "../../src/Drizzle/db";
import { EventsTable } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    EventsTable: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Events Service", () => {
  describe("createEvent", () => {
    it("should insert a event and return the inserted event", async () => {
      const event = {
            title: "Christmas Festival 2025",
            description: "Welcome to Christmas Festivals at Uhuru Park in Nairobi",
            category: "Festivals",
            eventDate: "2025-08-15",
            startTime: "2025-08-15T09:00:00.000Z",
            endTime: "2025-08-15T17:00:00.000Z",
            ticketPrice: 100.00,
            totalTickets: 400,
            availableTickets: 250,
            venueID: 1,
            isActive: true
      };

      const inserted = {
        eventID: 1,
        ...event,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([inserted]),
        }),
      });

      const result = await createEvent(event as any);
      expect(db.insert).toHaveBeenCalledWith(EventsTable);
      expect(result).toEqual(inserted);
    });

    it("should return null if insertion fails", async () => {
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([null]),
        }),
      });

      const result = await createEvent({
        title: "Christmas Festival 2025",
        description: "Welcome to Christmas Festivals at Uhuru Park in Nairobi",
        category: "Festivals",
        eventDate: "2025-08-15",
        startTime: "2025-08-15T09:00:00.000Z",
        endTime: "2025-08-15T17:00:00.000Z",
        ticketPrice: 100.00,
        totalTickets: 400,
        availableTickets: 250,
        venueID: 1,
        isActive: true
      } as any);

      expect(result).toBeNull();
    });
  });

  describe("getAllEvents", () => {
    it("should return all events", async () => {
      const events = [
        {
          eventID: 1,
          title: "Christmas Festival 2025",
          description: "Welcome to Christmas Festivals at Uhuru Park in Nairobi",
          category: "Festivals",
          eventDate: "2025-08-15",
          startTime: "2025-08-15T09:00:00.000Z",
          endTime: "2025-08-15T17:00:00.000Z",
          ticketPrice: 100.00,
          totalTickets: 400,
          availableTickets: 250,
          venueID: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (db.query.EventsTable.findMany as jest.Mock).mockResolvedValueOnce(events);

      const result = await getAllEvents();
      expect(result).toEqual(events);
    });

    it("should return empty array if no events exist", async () => {
      (db.query.EventsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getAllEvents();
      expect(result).toEqual([]);
    });
  });

  describe("getEventById", () => {
    it("should return a event if found", async () => {
      const event = {
          eventID: 1,
          title: "Christmas Festival 2025",
          description: "Welcome to Christmas Festivals at Uhuru Park in Nairobi",
          category: "Festivals",
          eventDate: "2025-08-15",
          startTime: "2025-08-15T09:00:00.000Z",
          endTime: "2025-08-15T17:00:00.000Z",
          ticketPrice: 100.00,
          totalTickets: 400,
          availableTickets: 250,
          venueID: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
      };

      (db.query.EventsTable.findFirst as jest.Mock).mockResolvedValueOnce(event);

      const result = await getEventById(1);
      expect(result).toEqual(event);
    });

    it("should return undefined if event is not found", async () => {
      (db.query.EventsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getEventById(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updateEvent", () => {
    it("should update a event and return the updated object", async () => {
      const updatedevent = {
        eventID: 1,
        title: "Easter Festival 2025",
        description: "Welcome to Easter Festival at Galleria in Nairobi",
        category: "Festivals",
        eventDate: "2025-08-19",
        startTime: "2025-08-15T09:00:00.000Z",
        endTime: "2025-08-15T17:00:00.000Z",
        ticketPrice: 50.00,
        totalTickets: 400,
        availableTickets: 250,
        venueID: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([updatedevent]),
          }),
        }),
      });

      const result = await updateEvent(1, updatedevent as any);
      expect(db.update).toHaveBeenCalledWith(EventsTable);
      expect(result).toEqual(updatedevent);
    });

    it("should return null if no event was updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([]),
          }),
        }),
      });

      const result = await updateEvent(1, {} as any);
      expect(result).toBeNull();
    });
  });

  describe("deleteEvent", () => {
    it("should delete a event and return success message", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(undefined),
      });

      const result = await deleteEvent(1);
      expect(db.delete).toHaveBeenCalledWith(EventsTable);
      expect(result).toBe("Event deleted successfully");
    });
  });
});
