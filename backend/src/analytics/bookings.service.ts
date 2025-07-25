import db from "../Drizzle/db";
import { BookingsTable, EventsTable } from "../Drizzle/schema";
import { sql } from "drizzle-orm";

export const getBookingsSummary = async () => {
  const result = await db.select({ total: sql`COUNT(*)` }).from(BookingsTable);
  return result[0]?.total ?? 0;
};

export const getBookingsByMonth = async () => {
  const result = await db
    .select({
      month: sql`TO_CHAR(${BookingsTable.bookingDate}, 'YYYY-MM')`,
      count: sql`COUNT(*)`,
    })
    .from(BookingsTable)
    .groupBy(sql`TO_CHAR(${BookingsTable.bookingDate}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${BookingsTable.bookingDate}, 'YYYY-MM')`);

  return result;
};

export const getTopBookedEvents = async () => {
  const result = await db
    .select({
      eventID: EventsTable.eventID,
      title: EventsTable.title,
      totalTickets: sql`SUM(${BookingsTable.numberOfTickets})`,
    })
    .from(BookingsTable)
    .innerJoin(EventsTable, sql`${EventsTable.eventID} = ${BookingsTable.eventID}`)
    .groupBy(EventsTable.eventID, EventsTable.title)
    .orderBy(sql`SUM(${BookingsTable.numberOfTickets}) DESC`)
    .limit(10);

  return result;
};