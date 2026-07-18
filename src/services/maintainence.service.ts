import { maintainenceRepository } from "../repository/maintainence.repository";
import { vehicleRepository } from "../repository/vehicle.repository";
import { prisma } from "../db";
import { AppError } from "../utils/error";
import { STATUS_CODES } from "../utils/constants";
import {
  CompleteMaintenanceSchemaType,
  CreateMaintenanceSchemaType,
  ListMaintenanceSchemaType,
  UpdateMaintenanceSchemaType,
} from "../utils/validations";
import { VehicleStatus } from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/client";

export const createMaintenanceService = async (
  data: CreateMaintenanceSchemaType,
  createdBy: string,
) => {
  const existingVehicle = await vehicleRepository.findUnique({
    id: data.vehicleId,
  });

  if (!existingVehicle) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Vehicle does not exist");
  }

  if (existingVehicle.status !== VehicleStatus.AVAILABLE) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Maintenance record can only be created for an available vehicle",
    );
  }

  const maintenanceRecord = await maintainenceRepository.create({
    vehicleId: data.vehicleId,
    serviceType: data.serviceType,
    ...(data.description !== undefined && { description: data.description }),
    cost: data.cost,
    serviceDate: data.serviceDate,
    ...(data.vendor !== undefined && { vendor: data.vendor }),
    createdBy,
  });

  await vehicleRepository.update(
    { id: data.vehicleId },
    { status: VehicleStatus.IN_SHOP },
  );

  return maintenanceRecord;
};

export const completeMaintenanceService = async (
  params: CompleteMaintenanceSchemaType,
) => {
  const record = await maintainenceRepository.findUnique({ id: params.id });

  if (!record) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Maintenance log not found");
  }

  if (record.isCompleted) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Maintenance log is already completed",
    );
  }

  const [updatedRecord] = await prisma.$transaction([
    maintainenceRepository.update(
      { id: params.id },
      { isCompleted: true },
    ),
    vehicleRepository.update(
      { id: record.vehicleId },
      { status: VehicleStatus.AVAILABLE },
    ),
  ]);

  return updatedRecord;
};

export const updateMaintenanceService = async (
  id: string,
  data: UpdateMaintenanceSchemaType,
) => {
  const record = await maintainenceRepository.findUnique({ id });

  if (!record) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Maintenance log not found");
  }

  if (record.isCompleted) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Cannot update a completed maintenance record",
    );
  }

  const updated = await maintainenceRepository.update({ id }, { ...data });

  return updated;
};

export const listMaintenanceService = async (
  query: ListMaintenanceSchemaType,
) => {
  const { page, perPage, search, sortOn, sortOrder, vehicleId, serviceType } = query;

  //skip
  const skipQuery = (page - 1) * perPage;

  //prepare where Obj
  let whereObj: Prisma.MaintenanceRecordWhereInput = {};

  if (search) {
    whereObj.vehicle =
    {
      name: {
        contains: search,
        mode: "insensitive",
      },

    }
  }

  if (vehicleId) {
    whereObj.vehicleId = vehicleId;
  }

  if (serviceType) {
    whereObj.serviceType = serviceType
  }

  // prepare sort obj
  let sortByObj: Prisma.MaintenanceRecordOrderByWithRelationInput;

  switch (sortOn) {
    case "vehicle":
      sortByObj = { vehicle: { name: sortOrder } };
      break;
    case "cost":
      sortByObj = { cost: sortOrder };
      break;
    default:
      sortByObj = { createdAt: sortOrder };
  }

  //prepate select object
  const includeObj: Prisma.MaintenanceRecordInclude = {
    vehicle: {
      select: {
        name: true,
        model: true,
      },
    },
  };
  const [records, totalCount] = await maintainenceRepository.findManyWithCount({
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
    result: records,
    meta,
  };
};
