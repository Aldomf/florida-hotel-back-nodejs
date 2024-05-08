/*
  Warnings:

  - Changed the type of `roomType` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'SUITE');

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomType",
ADD COLUMN     "roomType" "RoomType" NOT NULL;
