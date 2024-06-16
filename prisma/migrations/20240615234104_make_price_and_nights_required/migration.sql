/*
  Warnings:

  - Made the column `nights` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "nights" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;
