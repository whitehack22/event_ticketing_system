import db from "../Drizzle/db";
import { EventsTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TIEvent } from "../Drizzle/schema";

//Getting all events
export const getAllEvents = async () => {
  const events = await db.query.EventsTable.findMany()
    return events;
};

//Getting event by ID
export const getEventById = async (id: number) => {
   const event = await db.query.EventsTable.findFirst({
        where: eq(EventsTable.eventID, id)
  })
  return event
};

//Create a new event
export const createEvent = async (event: TIEvent) => {
    const [inserted] = await db.insert(EventsTable).values(event).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update event details
export const updateEvent =  async (id: number, event: TIEvent) => {
    const updated = await db
    .update(EventsTable)
    .set(event)
    .where(eq(EventsTable.eventID, id))
    .returning(); 

    if (!updated || updated.length === 0) {
        return null;
    }

    return updated[0]; 
};

//deleting event by ID
export const deleteEvent = async (id: number) => {
  await db.delete(EventsTable).where(eq(EventsTable.eventID, id))
  return "Event deleted successfully";
};



