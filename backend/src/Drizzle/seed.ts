import db from "./db";
import {
    UsersTable, VenuesTable, EventsTable, BookingsTable, PaymentsTable, CustomerSupportTicketsTable,
} from "./schema";

async function seed() {

    console.log("Seeding to database started...");

    // insert users
    await db.insert(UsersTable).values([
        { firstName: "James", lastName: "Johnson", email: "james@example.com", password: "hashedpassword3", contactPhone: "0712345678", address: "123 Main St", role: "user", isVerified: true },
        { firstName: "Rob", lastName: "Smith", email: "rob@example.com", password: "hashedpassword4", contactPhone: "0723456789", address: "456 Elm St", role: "admin", isVerified: true },
    ]);

    // insert venues
    await db.insert(VenuesTable).values([
        { name: "Grand Hall", address: "789 Oak Ave", capacity: 500, contactNumber: "0700000000" },  
    ]);

    // insert events
    await db.insert(EventsTable).values([
        { title: "Cake Festival 2025", description: "A major cake event", category: "Food", eventDate: new Date("2025-08-15T09:00:00Z"), startTime: new Date("2025-08-15T09:00:00Z"), endTime: new Date("2025-08-15T17:00:00Z"), ticketPrice: "100.00", totalTickets: 300, availableTickets: 250, venueID: 1 },
       
    ]);

    // insert bookings
    await db.insert(BookingsTable).values([
       { userID: 1, eventID: 1, numberOfTickets: 2, totalAmount: "200.00", },
    ]);

    // insert payments
    await db.insert(PaymentsTable).values([
       { bookingID: 1, amount: "200.00", paymentStatus: "Completed", paymentMethod: "Mpesa", transactionID: "TX123456789", userID: 1 },
    ]);
    
    // insert customer support tickets
    await db.insert(CustomerSupportTicketsTable).values([
        { userID: 1, subject: "Unable to download ticket", description: "I booked but can't download the ticket.", status: "Open" },
    ]);

    console.log("Seeding to database completed successfully.");
    process.exit(0); // 0 means success

}

seed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1); // 1 means an error occurred
})