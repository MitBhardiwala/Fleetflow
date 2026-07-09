/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `drivers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "drivers" ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "drivers_phone_key" ON "drivers"("phone");
