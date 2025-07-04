import db from "../Drizzle/db";
import { BookingsTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TIBooking } from "../Drizzle/schema";

//Getting all bookings
export const getAllBookings = async () => {
  const bookings = await db.query.BookingsTable.findMany()
    return bookings;
};

//Getting booking by ID
export const getBookingById = async (id: number) => {
   const booking = await db.query.BookingsTable.findFirst({
        where: eq(BookingsTable.bookingID, id)
  })
  return booking
};

//Create a new booking
export const createBooking = async (booking: TIBooking) => {
    const [inserted] = await db.insert(BookingsTable).values(booking).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update booking details
export const updateBooking =  async (id: number, booking: TIBooking) => {
    const updated = await db
    .update(BookingsTable)
    .set(booking)
    .where(eq(BookingsTable.bookingID, id))
    .returning(); 

    if (!updated || updated.length === 0) {
        return null;
    }

    return updated[0]; 
};

//deleting booking by ID
export const deleteBooking = async (id: number) => {
  await db.delete(BookingsTable).where(eq(BookingsTable.bookingID, id))
  return "Booking deleted successfully";
};

//Getting multiple bookings by ID
export const getBookingsById = async (id: number) => {
    const bookings = await db.query.BookingsTable.findMany({
        where: eq(BookingsTable.bookingID, id)
    })
    return bookings;
}


