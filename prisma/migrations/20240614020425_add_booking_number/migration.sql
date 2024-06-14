-- Add the new column with a temporary default value
ALTER TABLE "Booking" ADD COLUMN "bookingNumber" TEXT DEFAULT '';

-- Update existing rows to have a unique booking number
UPDATE "Booking" SET "bookingNumber" = gen_random_uuid()::text;

-- Alter the column to remove the default value and set it as NOT NULL
ALTER TABLE "Booking" ALTER COLUMN "bookingNumber" SET NOT NULL;
ALTER TABLE "Booking" ALTER COLUMN "bookingNumber" DROP DEFAULT;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

