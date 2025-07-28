import db from "./db";
import {
    UsersTable, VenuesTable, EventsTable, BookingsTable, PaymentsTable, CustomerSupportTicketsTable,
} from "./schema";

async function seed() {

    console.log("Seeding to database started...");
    console.log("Seeding to database completed successfully.");
    process.exit(0); // 0 means success

}

seed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1); // 1 means an error occurred
})