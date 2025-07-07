import db from "../Drizzle/db";
import { CustomerSupportTicketsTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TISupportTicket } from "../Drizzle/schema";

//Getting all tickets
export const getAllSupportTickets = async () => {
  const supportTickets = await db.query.CustomerSupportTicketsTable.findMany()
    return supportTickets;
};

//Getting ticket by ID
export const getSupportTicketById = async (id: number) => {
   const supportTicket = await db.query.CustomerSupportTicketsTable.findFirst({
        where: eq(CustomerSupportTicketsTable.ticketID, id)
  })
  return supportTicket
};

//Create a new Ticket
export const createSupportTicket = async (supportTicket: TISupportTicket) => {
    const [inserted] = await db.insert(CustomerSupportTicketsTable).values(supportTicket).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update ticket details
export const updateSupportTicket =  async (id: number, supportTicket: TISupportTicket) => {
    const updated = await db
    .update(CustomerSupportTicketsTable)
    .set(supportTicket)
    .where(eq(CustomerSupportTicketsTable.ticketID, id))
    .returning(); 

    if (!updated || updated.length === 0) {
        return null;
    }

    return updated[0]; 
};

//deleting ticket by ID
export const deleteSupportTicket = async (id: number) => {
  await db.delete(CustomerSupportTicketsTable).where(eq(CustomerSupportTicketsTable.ticketID, id))
  return "Support ticket deleted successfully";
};

//Getting multiple tickets by ID
export const getSupportTicketsById = async (id: number) => {
    const supportTickets = await db.query.CustomerSupportTicketsTable.findMany({
        where: eq(CustomerSupportTicketsTable.ticketID, id)
    })
    return supportTickets;
}


