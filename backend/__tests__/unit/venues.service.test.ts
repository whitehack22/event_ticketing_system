import {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue
} from "../../src/venues/venue.service";
import db from "../../src/Drizzle/db";
import { VenuesTable } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    VenuesTable: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Venues Service", () => {
  describe("createVenue", () => {
    it("should insert a venue and return the inserted venue", async () => {
      const venue = {
             name: "Aberdare National Park",
            address: "123 Nyeri",
            capacity: 500,
            contactNumber: "0722311455"
      };

      const inserted = {
        venueID: 1,
        ...venue,
        createdAt: new Date(),
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([inserted]),
        }),
      });

      const result = await createVenue(venue as any);
      expect(db.insert).toHaveBeenCalledWith(VenuesTable);
      expect(result).toEqual(inserted);
    });

    it("should return null if insertion fails", async () => {
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([null]),
        }),
      });

      const result = await createVenue({
        title: "Christmas Festival 2025",
        description: "Welcome to Christmas Festivals at Uhuru Park in Nairobi",
        category: "Festivals",
        venueDate: "2025-08-15",
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

  describe("getAllVenues", () => {
    it("should return all venues", async () => {
      const venues = [
        {
          venueID: 1,
          title: "Christmas Festival 2025",
          description: "Welcome to Christmas Festivals at Uhuru Park in Nairobi",
          category: "Festivals",
          venueDate: "2025-08-15",
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

      (db.query.VenuesTable.findMany as jest.Mock).mockResolvedValueOnce(venues);

      const result = await getAllVenues();
      expect(result).toEqual(venues);
    });

    it("should return empty array if no venues exist", async () => {
      (db.query.VenuesTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getAllVenues();
      expect(result).toEqual([]);
    });
  });

  describe("getVenueById", () => {
    it("should return a venue if found", async () => {
      const venue = {
          venueID: 1,
          title: "Christmas Festival 2025",
          description: "Welcome to Christmas Festivals at Uhuru Park in Nairobi",
          category: "Festivals",
          venueDate: "2025-08-15",
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

      (db.query.VenuesTable.findFirst as jest.Mock).mockResolvedValueOnce(venue);

      const result = await getVenueById(1);
      expect(result).toEqual(venue);
    });

    it("should return undefined if venue is not found", async () => {
      (db.query.VenuesTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getVenueById(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updateVenue", () => {
    it("should update a venue and return the updated object", async () => {
      const updatedvenue = {
        venueID: 1,
        title: "Easter Festival 2025",
        description: "Welcome to Easter Festival at Galleria in Nairobi",
        category: "Festivals",
        venueDate: "2025-08-19",
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
            returning: jest.fn().mockResolvedValueOnce([updatedvenue]),
          }),
        }),
      });

      const result = await updateVenue(1, updatedvenue as any);
      expect(db.update).toHaveBeenCalledWith(VenuesTable);
      expect(result).toEqual(updatedvenue);
    });

    it("should return null if no venue was updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([]),
          }),
        }),
      });

      const result = await updateVenue(1, {} as any);
      expect(result).toBeNull();
    });
  });

  describe("deleteVenue", () => {
    it("should delete a venue and return success message", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(undefined),
      });

      const result = await deleteVenue(1);
      expect(db.delete).toHaveBeenCalledWith(VenuesTable);
      expect(result).toBe("Venue deleted successfully");
    });
  });
});
