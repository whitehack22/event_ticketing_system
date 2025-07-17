import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { text, varchar, serial, pgTable, decimal, integer, boolean, timestamp,} from "drizzle-orm/pg-core";

/* ENUMS */

// Role Enum
export const RoleEnum = pgEnum("role", ["admin", "user"]);

// Payment Status Enum
export const PaymentStatusEnum = pgEnum("payment_status", [ "Pending", "Completed", "Failed", "Refunded",]);

// Ticket Status Enum
export const TicketStatusEnum = pgEnum("ticket_status", [ "Open", "In Progress", "Resolved", "Closed", ]);

/* TABLES */

// Users Table
export const UsersTable = pgTable("users", {
  userID: serial("userID").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  role: RoleEnum("role").default("user"),
  isVerified: boolean("is_verified").default(false),
  verificationCode: varchar("verification_code", { length: 50 }),
  image_url: varchar("image_url", { length: 255 }).default("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Venues Table
export const VenuesTable = pgTable("venues", {
  venueID: serial("venueID").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  address: text("address").notNull(),
  capacity: integer("capacity").notNull(),
  contactNumber: varchar("contact_number", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events Table
export const EventsTable = pgTable("events", {
  eventID: serial("eventID").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  eventDate: timestamp("event_date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  ticketPrice: decimal("ticket_price", { precision: 10, scale: 2 }).notNull(),
  totalTickets: integer("total_tickets").notNull(),
  availableTickets: integer("available_tickets").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  image_url: varchar("image_url", { length: 255 }).default("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"),
  venueID: integer("venueID")
    .references(() => VenuesTable.venueID, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bookings Table
export const BookingsTable = pgTable("bookings", {
  bookingID: serial("bookingID").primaryKey(),
  userID: integer("userID")
    .notNull()
    .references(() => UsersTable.userID, { onDelete: "cascade" }),
  eventID: integer("eventID")
    .notNull()
    .references(() => EventsTable.eventID, { onDelete: "cascade" }),
  numberOfTickets: integer("number_of_tickets").notNull().default(1),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
  bookingStatus: varchar("booking_status", { length: 20 }).default("Confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payments Table
export const PaymentsTable = pgTable("payments", {
  paymentID: serial("paymentID").primaryKey(),
  bookingID: integer("bookingID")
    .notNull()
    .references(() => BookingsTable.bookingID, { onDelete: "cascade" }),
  userID: integer("userID")
    .notNull()
    .references(() => UsersTable.userID, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: PaymentStatusEnum("payment_status").default("Pending"),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionID: varchar("transaction_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customer Support Tickets Table
export const CustomerSupportTicketsTable = pgTable("customer_support_tickets", {
  ticketID: serial("ticketID").primaryKey(),
  userID: integer("userID")
    .notNull()
    .references(() => UsersTable.userID, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 200 }).notNull(),
  description: text("description").notNull(),
  status: TicketStatusEnum("status").default("Open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* RELATIONS */

// User Relations
export const UsersRelations = relations(UsersTable, ({ many }) => ({
  bookings: many(BookingsTable),
  payments: many(PaymentsTable),
  supportTickets: many(CustomerSupportTicketsTable),
}));

// Venue Relations
export const VenuesRelations = relations(VenuesTable, ({ many }) => ({
  events: many(EventsTable),
}));

// Event Relations
export const EventsRelations = relations(EventsTable, ({ many, one }) => ({
  venue: one(VenuesTable, {
    fields: [EventsTable.venueID],
    references: [VenuesTable.venueID],
  }),
  bookings: many(BookingsTable),
}));

// Booking Relations
export const BookingsRelations = relations(BookingsTable, ({ one }) => ({
  customer: one(UsersTable, {
    fields: [BookingsTable.userID],
    references: [UsersTable.userID],
  }),
  event: one(EventsTable, {
    fields: [BookingsTable.eventID],
    references: [EventsTable.eventID],
  }),
  payment: one(PaymentsTable, {
    fields: [BookingsTable.bookingID],
    references: [PaymentsTable.bookingID],
  }),
}));

// Payment Relations
export const PaymentsRelations = relations(PaymentsTable, ({ one }) => ({
  customer: one(UsersTable, {
    fields: [PaymentsTable.userID],
    references: [UsersTable.userID],
  }),
  booking: one(BookingsTable, {
    fields: [PaymentsTable.bookingID],
    references: [BookingsTable.bookingID],
  }),
}));

// Customer Support Tickets Relations
export const CustomerSupportTicketsRelations = relations(
  CustomerSupportTicketsTable,
  ({ one }) => ({
    user: one(UsersTable, {
      fields: [CustomerSupportTicketsTable.userID],
      references: [UsersTable.userID],
    }),
  })
);

/* TYPES */

export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

export type TIVenue = typeof VenuesTable.$inferInsert;
export type TSVenue = typeof VenuesTable.$inferSelect;

export type TIEvent = typeof EventsTable.$inferInsert;
export type TSEvent = typeof EventsTable.$inferSelect;

export type TIBooking = typeof BookingsTable.$inferInsert;
export type TSBooking = typeof BookingsTable.$inferSelect;

export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;

export type TISupportTicket = typeof CustomerSupportTicketsTable.$inferInsert;
export type TSSupportTicket = typeof CustomerSupportTicketsTable.$inferSelect;

