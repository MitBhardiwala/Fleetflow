import { Driver, Vehicle } from "../../generated/prisma/client.ts";
import { DriverStatus, TripStatus, VehicleStatus } from "../../generated/prisma/enums.ts";
import { driverRepository } from "../repository/driver.repository.ts";
import { tripRepository } from "../repository/trip.repository.ts";
import { vehicleRepository } from "../repository/vehicle.repository.ts";
import { STATUS_CODES } from "../utils/constants.ts";
import { AppError } from "../utils/error.ts";
import { CompleteTripSchemaType } from "./validations.ts";

export const validateVehicleAvailability = (vehicle: Vehicle) => {
  if (vehicle.status !== VehicleStatus.AVAILABLE) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Vehicle is currently unavailable",
    );
  }
};

export const validateDriverAvailability = (driver: Driver) => {
  if (driver.status !== DriverStatus.ON_DUTY) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Driver is currently unavailable",
    );
  }
};

export const validateLicenseCategoryMatch = (
  driver: Driver,
  vehicle: Vehicle,
) => {
  if (driver.licenseCategory !== vehicle.type) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Driver license category and vehicle type does not match",
    );
  }
};

export const validateCargoCapacity = (
  vehicle: Vehicle,
  cargoWeightKg: number,
) => {
  if (vehicle.maxLoadCapacityKg.toNumber() < cargoWeightKg) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Cargo weight exceeds vehicle capacity",
    );
  }
};

export const validateLicenseExpiry = (driver: Driver) => {
  const licenseExpiryDate = new Date(driver.licenseExpiryDate);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  licenseExpiryDate.setUTCHours(0, 0, 0, 0);

  if (licenseExpiryDate <= today) {
    throw new AppError(STATUS_CODES.CONFLICT, "Driver license is EXPIRED");
  }
};

export const validateTripCreation = async (
  vehicleId: string,
  driverId: string,
  cargoWeightKg: number,
) => {
  const [vehicle, driver] = await Promise.all([
    vehicleRepository.findUnique({ id: vehicleId }),
    driverRepository.findUnique({ id: driverId }),
  ]);

  if (!vehicle) throw new AppError(STATUS_CODES.NOT_FOUND, "No vehicle found");
  if (!driver) throw new AppError(STATUS_CODES.NOT_FOUND, "No driver found");

  validateVehicleAvailability(vehicle);
  validateDriverAvailability(driver);
  validateLicenseCategoryMatch(driver, vehicle);
  validateCargoCapacity(vehicle, cargoWeightKg);
  validateLicenseExpiry(driver);
};

export const validateTripCompletion = async (
  tripId: string,
  data: CompleteTripSchemaType,
) => {
  const existingTrip = await tripRepository.findUnique({ id: tripId });

  if (!existingTrip) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Trip does not exist");
  }

  if (existingTrip.status !== "DISPATCHED") {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Trip can only be completed after it is dispatched",
    );
  }

  const actualEnd = data.actualEnd ?? existingTrip.actualEnd;
  const revenue = data.revenue ?? existingTrip.revenue;

  if (!actualEnd) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "actualEnd is required to complete the trip",
    );
  }

  if (existingTrip.actualStart && actualEnd <= existingTrip.actualStart) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "Actual end must be after actual start",
    );
  }

  if (revenue === undefined || revenue === null) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "Trip revenue is required to complete the trip",
    );
  }

  if (
    existingTrip.startOdometerKm !== null &&
    data.endOdometerKm < existingTrip.startOdometerKm.toNumber()
  ) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "End odometer cannot be less than start odometer",
    );
  }

  return {
    existingTrip,
    actualEnd,
    revenue,
  };
};

export const validateTripCancellation = async (tripId: string) => {
  const existingTrip = await tripRepository.findUnique({ id: tripId });

  if (!existingTrip) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Trip does not exist");
  }

  if (existingTrip.status !== TripStatus.DISPATCHED) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Trip can only be cancelled after it is dispatched",
    );
  }

  return existingTrip;
};
