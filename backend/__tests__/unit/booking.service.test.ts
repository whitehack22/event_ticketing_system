import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByUserId,
} from "../../src/bookings/booking.service";
import db from "../../src/Drizzle/db";
import { BookingsTable } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    BookingsTable: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Bookings Service", () => {
  describe("createBooking", () => {
    it("should insert a booking and return the inserted booking", async () => {
      const booking = {
        userID: 1,
        eventID: 2,
        numberOfTickets: 3,
        totalAmount: "150.00",
        bookingStatus: "Confirmed",
      };

      const inserted = {
        bookingID: 1,
        ...booking,
        bookingDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([inserted]),
        }),
      });

      const result = await createBooking(booking as any);
      expect(db.insert).toHaveBeenCalledWith(BookingsTable);
      expect(result).toEqual(inserted);
    });

    it("should return null if insertion fails", async () => {
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([null]),
        }),
      });

      const result = await createBooking({
        userID: 1,
        eventID: 2,
        numberOfTickets: 3,
        totalAmount: "150.00",
        bookingStatus: "Confirmed",
      } as any);

      expect(result).toBeNull();
    });
  });

  describe("getAllBookings", () => {
    it("should return all bookings", async () => {
      const bookings = [
        {
          bookingID: 1,
          userID: 1,
          eventID: 2,
          numberOfTickets: 2,
          totalAmount: "100.00",
          bookingDate: new Date(),
          bookingStatus: "Confirmed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce(bookings);

      const result = await getAllBookings();
      expect(result).toEqual(bookings);
    });

    it("should return empty array if no bookings exist", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getAllBookings();
      expect(result).toEqual([]);
    });
  });

  describe("getBookingById", () => {
    it("should return a booking if found", async () => {
      const booking = {
        bookingID: 1,
        userID: 1,
        eventID: 2,
        numberOfTickets: 2,
        totalAmount: "100.00",
        bookingDate: new Date(),
        bookingStatus: "Confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValueOnce(booking);

      const result = await getBookingById(1);
      expect(result).toEqual(booking);
    });

    it("should return undefined if booking is not found", async () => {
      (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getBookingById(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updateBooking", () => {
    it("should update a booking and return the updated object", async () => {
      const updatedBooking = {
        bookingID: 1,
        userID: 1,
        eventID: 2,
        numberOfTickets: 4,
        totalAmount: "200.00",
        bookingStatus: "Confirmed",
        bookingDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([updatedBooking]),
          }),
        }),
      });

      const result = await updateBooking(1, updatedBooking as any);
      expect(db.update).toHaveBeenCalledWith(BookingsTable);
      expect(result).toEqual(updatedBooking);
    });

    it("should return null if no booking was updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([]),
          }),
        }),
      });

      const result = await updateBooking(1, {} as any);
      expect(result).toBeNull();
    });
  });

  describe("deleteBooking", () => {
    it("should delete a booking and return success message", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(undefined),
      });

      const result = await deleteBooking(1);
      expect(db.delete).toHaveBeenCalledWith(BookingsTable);
      expect(result).toBe("Booking deleted successfully");
    });
  });

  describe("getBookingsByUserId", () => {
    it("should return bookings for a specific user", async () => {
      const userBookings = [
        {
          bookingID: 1,
          userID: 3,
          eventID: 4,
          numberOfTickets: 2,
          totalAmount: "120.00",
          bookingStatus: "Confirmed",
          bookingDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce(userBookings);

      const result = await getBookingsByUserId(3);
      expect(result).toEqual(userBookings);
    });

    it("should return empty array if user has no bookings", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getBookingsByUserId(10);
      expect(result).toEqual([]);
    });
  });
});
