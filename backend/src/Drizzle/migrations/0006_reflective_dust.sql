ALTER TABLE "bookings" ADD COLUMN "checkout_request_id" varchar(100);--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "transaction_id";