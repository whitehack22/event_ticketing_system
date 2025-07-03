CREATE TYPE "public"."payment_status" AS ENUM('Pending', 'Completed', 'Failed', 'Refunded');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('Open', 'In Progress', 'Resolved', 'Closed');--> statement-breakpoint
CREATE TABLE "bookings" (
	"bookingID" serial PRIMARY KEY NOT NULL,
	"userID" integer NOT NULL,
	"eventID" integer NOT NULL,
	"number_of_tickets" integer DEFAULT 1 NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"booking_date" timestamp DEFAULT now() NOT NULL,
	"booking_status" varchar(20) DEFAULT 'Confirmed',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_support_tickets" (
	"ticketID" serial PRIMARY KEY NOT NULL,
	"userID" integer NOT NULL,
	"subject" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"status" "ticket_status" DEFAULT 'Open',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"eventID" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"category" varchar(100),
	"event_date" timestamp NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"ticket_price" numeric(10, 2) NOT NULL,
	"total_tickets" integer NOT NULL,
	"available_tickets" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true,
	"venueID" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"paymentID" serial PRIMARY KEY NOT NULL,
	"bookingID" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'Pending',
	"payment_date" timestamp DEFAULT now() NOT NULL,
	"payment_method" varchar(50),
	"transaction_id" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userID" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"contact_phone" varchar(20),
	"address" varchar(255),
	"role" "role" DEFAULT 'user',
	"is_verified" boolean DEFAULT false,
	"verification_code" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"venueID" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" text NOT NULL,
	"capacity" integer NOT NULL,
	"contact_number" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userID_users_userID_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("userID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_eventID_events_eventID_fk" FOREIGN KEY ("eventID") REFERENCES "public"."events"("eventID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_support_tickets" ADD CONSTRAINT "customer_support_tickets_userID_users_userID_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("userID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_venueID_venues_venueID_fk" FOREIGN KEY ("venueID") REFERENCES "public"."venues"("venueID") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingID_bookings_bookingID_fk" FOREIGN KEY ("bookingID") REFERENCES "public"."bookings"("bookingID") ON DELETE cascade ON UPDATE no action;