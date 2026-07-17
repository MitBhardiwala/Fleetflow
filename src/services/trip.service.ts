import { tripRepository } from "../repository/trip.repository";
import {
  CompleteTripSchemaType,
  CancelTripSchemaType,
  CreateTripSchemaType,
  DispatchTripSchemaType,
  ListTripSchemaType,
} from "../utils/validations";
import {
  validateTripCompletion,
  validateTripCancellation,
  validateTripCreation,
} from "../utils/trip.validations";
import {
  DriverStatus,
  Prisma,
  TripStatus,
  VehicleStatus,
} from "../../generated/prisma/client";
import { driverRepository } from "../repository/driver.repository";
import { vehicleRepository } from "../repository/vehicle.repository";
import { AppError } from "../utils/error";
import { STATUS_CODES } from "../utils/constants";
import { prisma } from "../db";

export const createTripService = async (data: CreateTripSchemaType) => {
  const { vehicleId, driverId } = data;

  // TODO neeed to add createtdBy here
  await validateTripCreation(vehicleId, driverId, data.cargoWeightKg);

  return tripRepository.create(data);
};

export const listTripService = async (query: ListTripSchemaType) => {
  const { page, perPage, search, sortOn, sortOrder, status } = query;

  // skip
  const skipQuery = (page - 1) * perPage;

  // prepare where obj
  let whereObj: Prisma.TripWhereInput = {};

  if (search) {
    whereObj.OR = [
      {
        driver: {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        vehicle: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              model: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    ];
  }

  if (status) {
    whereObj.status = status;
  }

  // prepare sort obj
  let sortByObj: Prisma.TripOrderByWithRelationInput;

  switch (sortOn) {
    case "vehicle":
      sortByObj = { vehicle: { name: sortOrder } };
      break;
    case "driver":
      sortByObj = { driver: { firstName: sortOrder } };
      break;
    default:
      sortByObj = { createdAt: sortOrder };
  }

  //prepate select object
  const includeObj: Prisma.TripInclude = {
    driver: {
      select: {
        firstName: true,
        lastName: true,
      },
    },
    vehicle: {
      select: {
        name: true,
        model: true,
      },
    },
  };
  const [drivers, totalCount] = await tripRepository.findManyWithCount({
    where: whereObj,
    orderBy: sortByObj,
    include: includeObj,
    skip: skipQuery,
    take: perPage,
  });

  // prepare meta deta
  const totalPages = Math.ceil(totalCount / perPage);
  const meta = {
    currentPage: page,
    perPage,
    totalItems: totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
  return {
    result: drivers,
    meta,
  };
};

export const dispatchTripService = async (
  data: DispatchTripSchemaType,
  tripId?: string | null,
) => {
  if (tripId) {
    const existingTrip = await tripRepository.findUnique({ id: tripId });
    if (!existingTrip) {
      throw new AppError(STATUS_CODES.NOT_FOUND, "Trip does not exist");
    }

    if (existingTrip.status != TripStatus.DRAFT) {
      throw new AppError(
        STATUS_CODES.CONFLICT,
        "Only drafted Trips cab ne dispatched",
      );
    }
  }

  const { vehicleId, driverId } = data;

  //validate trip
  await validateTripCreation(vehicleId, driverId, data.cargoWeightKg);

  //prepare trip creation data;
  const newData = {
    ...data,
    status: TripStatus.DISPATCHED,
  };

  // Create trip or updat existing trip
  const newTrip = tripId
    ? await tripRepository.update({ id: tripId }, newData)
    : await tripRepository.create(newData);

  // Driver status will be changed to ON_TRIP
  await driverRepository.update(
    { id: driverId },
    { status: DriverStatus.ON_TRIP },
  );
  //vehcile status will be changed to ON_TRIP
  await vehicleRepository.update(
    { id: vehicleId },
    { status: VehicleStatus.ON_TRIP },
  );

  return newTrip;
};

export const completeTripService = async (
  data: CompleteTripSchemaType,
  tripId: string,
) => {
  const { existingTrip, actualEnd, revenue } = await validateTripCompletion(
    tripId,
    data,
  );

  return prisma.$transaction(async (tx) => {
    const completedTrip = await tx.trip.update({
      where: { id: tripId },
      data: {
        endOdometerKm: data.endOdometerKm,
        actualEnd,
        revenue,
        status: TripStatus.COMPLETED,
      },
    });

    await tx.vehicle.update({
      where: { id: existingTrip.vehicleId },
      data: {
        status: VehicleStatus.AVAILABLE,
        currentOdometerKm: data.endOdometerKm,
      },
    });

    await tx.driver.update({
      where: { id: existingTrip.driverId },
      data: {
        status: DriverStatus.ON_DUTY,
        completedTrips: {
          increment: 1,
        },
        totalTrips: {
          increment: 1,
        },
      },
    });

    return completedTrip;
  });
};

export const cancelTripService = async (
  tripId: string,
  data: CancelTripSchemaType,
) => {
  const existingTrip = await validateTripCancellation(tripId);
  const cancellationReason = data.cancellationReason;
  return prisma.$transaction(async (tx) => {
    const cancelledTrip = await tx.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.CANCELLED,
        ...(cancellationReason !== undefined && {
          cancellationReason,
        }),
      },
    });

    await tx.vehicle.update({
      where: { id: existingTrip.vehicleId },
      data: {
        status: VehicleStatus.AVAILABLE,
      },
    });

    await tx.driver.update({
      where: { id: existingTrip.driverId },
      data: {
        status: DriverStatus.ON_DUTY,
        totalTrips: {
          increment: 1,
        },
      },
    });

    return cancelledTrip;
  });
};
