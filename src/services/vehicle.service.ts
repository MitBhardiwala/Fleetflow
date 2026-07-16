import { Prisma, VehicleStatus } from "../../generated/prisma/client";
import { vehicleRepository } from "../repository/vehicle.repository";
import { STATUS_CODES } from "../utils/constants";
import { AppError } from "../utils/error";
import {
  CreateVehicleSchemaType,
  GetVehicleSchemaType,
  ListVehicleSchemaType,
  UpdateVehicleSchemaType,
} from "../utils/validations";

export const createVehicleService = async (data: CreateVehicleSchemaType) => {
  //check if any vehicle if same licenPlate exists or not
  const { licensePlate } = data;

  const existingVehicle = await vehicleRepository.findUnique({ licensePlate });

  if (existingVehicle) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "Vehicle with same number plate exists",
    );
  }

  const newVehicle = await vehicleRepository.create(data);

  return newVehicle;
};

export const listVehicleService = async (query: ListVehicleSchemaType) => {
  const { page, perPage, search, sortOn, sortOrder, status, type } = query;

  // skip
  const skipQuery = (page - 1) * perPage;

  // prepare where obj
  let whereObj: Prisma.VehicleWhereInput = {};

  if (search) {
    whereObj.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
    ];
  }

  // filter for status and type

  if (status) {
    whereObj.OR = [...(whereObj.OR ?? []), { status }];
  }

  if (type) {
    whereObj.OR = [...(whereObj.OR ?? []), { type }];
  }

  //prepare sort obj
  const sortByObj: Prisma.VehicleOrderByWithRelationInput = {
    [sortOn]: sortOrder,
  };

  const [drivers, totalCount] = await vehicleRepository.findManyWithCount({
    where: whereObj,
    orderBy: sortByObj,
    skip: skipQuery,
    take: perPage,
  });

  // prepare meta deta
  const totalPages = Math.ceil(totalCount / perPage);
  const meta = {
    currenPage: page,
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

export const getVehicleService = async (id: GetVehicleSchemaType["id"]) => {
  const existingVehicle = await vehicleRepository.findUnique({
    id,
  });

  if (!existingVehicle) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "No vehicle found");
  }

  return existingVehicle;
};

export const updateVehicleService = async (
  id: string,
  data: UpdateVehicleSchemaType
) => {
  const { status } = data;

  const existing = await vehicleRepository.findUnique({ id });

  if (!existing) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Vehicle not found");
  }

  const isStatusChanging = status !== undefined && status !== existing.status;

  if (isStatusChanging) {
    // ON_TRIP is set by trip dispatch; IN_SHOP is set by maintenance creation
    if (
      existing.status === VehicleStatus.ON_TRIP ||
      existing.status === VehicleStatus.IN_SHOP
    ) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        "Vehicle status cannot be changed while it is on a trip or in maintenance"
      );
    }

    if (
      status === VehicleStatus.ON_TRIP ||
      status === VehicleStatus.IN_SHOP
    ) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        "Vehicle status cannot be manually set to ON_TRIP or IN_SHOP"
      );
    }
  }

  return await vehicleRepository.update({ id }, data);
};

export const deleteVehicleService = async (id: string) => {
  const existing = await vehicleRepository.findUnique({ id });

  if (!existing) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Vehicle not found");
  }

  // ON_TRIP → active trip in progress
  if (existing.status === VehicleStatus.ON_TRIP) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "Vehicle is currently on a trip and cannot be deleted"
    );
  }

  // IN_SHOP → active maintenance record open
  if (existing.status === VehicleStatus.IN_SHOP) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "Vehicle has an active maintenance record and cannot be deleted"
    );
  }

  return await vehicleRepository.update(
    { id },
    { status: VehicleStatus.OUT_OF_SERVICE }
  );
};
