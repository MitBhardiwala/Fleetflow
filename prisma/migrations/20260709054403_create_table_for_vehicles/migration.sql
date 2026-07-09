/*
  Warnings:

  - You are about to drop the column `updated_at_at` on the `drivers` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('TRUCK', 'VAN', 'BIKE');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'OUT_OF_SERVICE');

-- AlterTable
ALTER TABLE "drivers" RENAME COLUMN "updated_at_at" TO "updated_at";

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100),
    "license_plate" VARCHAR(20) NOT NULL,
    "type" "VehicleType" NOT NULL,
    "max_load_capacity_kg" DECIMAL(10,2) NOT NULL,
    "current_odometer_km" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "VehicleStatus" NOT NULL,
    "acquisition_cost" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_license_plate_key" ON "vehicles"("license_plate");
