ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DEFAULT 'Completed';--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "checkout_request_id";