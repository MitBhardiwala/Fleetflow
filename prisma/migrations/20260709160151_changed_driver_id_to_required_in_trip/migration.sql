/*
  Warnings:

  - Made the column `driver_id` on table `trips` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_driver_id_fkey";

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "driver_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
