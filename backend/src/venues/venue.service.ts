import db from "../Drizzle/db";
import { VenuesTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TIVenue } from "../Drizzle/schema";

//Getting all venues
export const getAllVenues = async () => {
  const venues = await db.query.VenuesTable.findMany()
    return venues;
};

//Getting venue by ID
export const getVenueById = async (id: number) => {
   const venue = await db.query.VenuesTable.findFirst({
        where: eq(VenuesTable.venueID, id)
  })
  return venue
};

//Create a new venue
export const createVenue = async (venue: TIVenue) => {
    const [inserted] = await db.insert(VenuesTable).values(venue).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update venue details
export const updateVenue =  async (id: number, venue: TIVenue) => {
    const updated = await db
    .update(VenuesTable)
    .set(venue)
    .where(eq(VenuesTable.venueID, id))
    .returning(); 

    if (!updated || updated.length === 0) {
        return null;
    }

    return updated[0]; 
};

//deleting venue by ID
export const deleteVenue = async (id: number) => {
  await db.delete(VenuesTable).where(eq(VenuesTable.venueID, id))
  return "Venue deleted successfully";
};

//Getting multiple venues by ID
export const getVenuesById = async (id: number) => {
    const venues = await db.query.VenuesTable.findMany({
        where: eq(VenuesTable.venueID, id)
    })
    return venues;
}


