import { Prisma } from "../../generated/prisma/client";
import { vehicleRepository } from "../repository/vehicle.repository";
import { STATUS_CODES } from "../utils/constants";
import { AppError } from "../utils/error";
import {
  CreateVehicleSchemaType,
  GetVehicleSchemaType,
  ListVehicleSchemaType,
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
