import { fuelLogRepository } from "../repository/fuel-log.repository";
import { vehicleRepository } from "../repository/vehicle.repository";
import { tripRepository } from "../repository/trip.repository";
import { AppError } from "../utils/error";
import { STATUS_CODES } from "../utils/constants";
import { CreateFuelLogSchemaType, ListFuelLogSchemaType } from "../utils/validations";
import { Prisma } from "../../generated/prisma/client";

export const createFuelLogService = async (
  data: CreateFuelLogSchemaType,
  createdBy: string,
) => {
  // 1. Validate vehicle exists
  const vehicle = await vehicleRepository.findUnique({ id: data.vehicleId });

  if (!vehicle) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Vehicle does not exist");
  }

  // 2. Validate trip (if supplied)
  if (data.tripId) {
    const trip = await tripRepository.findUnique({ id: data.tripId });

    if (!trip) {
      throw new AppError(STATUS_CODES.NOT_FOUND, "Trip does not exist");
    }

    if (trip.vehicleId !== data.vehicleId) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        "Trip does not belong to the specified vehicle",
      );
    }
  }

  // 3. Compute totalCost server-side
  const totalCost = Math.round(data.liters * data.costPerLiter * 100) / 100;

  // 4. Persist fuel log
  const fuelLog = await fuelLogRepository.create({
    vehicleId: data.vehicleId,
    ...(data.tripId !== undefined && { tripId: data.tripId }),
    liters: data.liters,
    costPerLiter: data.costPerLiter,
    totalCost,
    ...(data.odometerAtFillKm !== undefined && {
      odometerAtFillKm: data.odometerAtFillKm,
    }),
    fuelDate: data.fuelDate,
    createdBy,
  });

  // 5. Update vehicle odometer if new reading is higher
  if (
    data.odometerAtFillKm !== undefined &&
    data.odometerAtFillKm > vehicle.currentOdometerKm.toNumber()
  ) {
    await vehicleRepository.update(
      { id: data.vehicleId },
      { currentOdometerKm: data.odometerAtFillKm },
    );
  }

  return fuelLog;
};

export const listFuelLogsService = async (query: ListFuelLogSchemaType) => {
  const { page, perPage, search, vehicleId, tripId, sortOn, sortOrder } = query;

  // skip
  const skipQuery = (page - 1) * perPage;

  // build where
  let whereObj: Prisma.FuelLogWhereInput = {};

  if (search) {
    whereObj.vehicle = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  if (vehicleId) {
    whereObj.vehicleId = vehicleId;
  }

  if (tripId) {
    whereObj.tripId = tripId;
  }

  // build orderBy
  let sortByObj: Prisma.FuelLogOrderByWithRelationInput;

  switch (sortOn) {
    case "vehicle":
      sortByObj = { vehicle: { name: sortOrder } };
      break;
    case "totalCost":
      sortByObj = { totalCost: sortOrder };
      break;
    case "fuelDate":
      sortByObj = { fuelDate: sortOrder };
      break;
    default:
      sortByObj = { createdAt: sortOrder };
  }

  // build include
  const includeObj: Prisma.FuelLogInclude = {
    vehicle: {
      select: { name: true, model: true },
    },
    trip: {
      select: { id: true },
    },
  };

  const [logs, totalCount] = await fuelLogRepository.findManyWithCount({
    where: whereObj,
    orderBy: sortByObj,
    include: includeObj,
    skip: skipQuery,
    take: perPage,
  });

  // meta
  const totalPages = Math.ceil(totalCount / perPage);
  const meta = {
    currentPage: page,
    perPage,
    totalItems: totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { result: logs, meta };
};
