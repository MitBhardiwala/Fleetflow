import { Driver, Vehicle } from "../../generated/prisma/client";
import { DriverStatus, VehicleStatus } from "../../generated/prisma/enums";
import { driverRepository } from "../repository/driver.repository";
import { vehicleRepository } from "../repository/vehicle.repository";
import { STATUS_CODES } from "../utils/constants";
import { AppError } from "../utils/error";

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
