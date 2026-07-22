import { Prisma } from "../../generated/prisma/client.ts";
import { DriverStatus } from "../../generated/prisma/enums.ts";
import { driverRepository } from "../repository/driver.repository.ts";
import { STATUS_CODES } from "../utils/constants.ts";
import { AppError } from "../utils/error.ts";
import {
  CreateDriverSchemaType,
  listDriverSchemaType,
  UpdateDriverSchemaType,
} from "../utils/validations.ts";

export const createDriverService = async (data: CreateDriverSchemaType) => {
  const {
    firstName,
    phone,
    licenseNumber,
    licenseExpiryDate,
    licenseCategory,
    lastName,
    status,
    safetyScore,
  } = data;
  // create if driver already exists
  const existingDriver = await driverRepository.findFirst({
    OR: [{ phone: data.phone }, { licenseNumber: data.licenseNumber }],
  });

  if (existingDriver) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "Driver with this phone number or license number already exists",
    );
  }

  // prepare driver create data
  const newDriver = await driverRepository.create({
    firstName,
    ...(lastName !== undefined && { lastName: lastName }),
    phone,
    licenseNumber,
    licenseExpiryDate,
    licenseCategory,
    ...(status !== undefined && { status: status }),
    safetyScore,
  });

  return newDriver;
};

export const getDriverService = async (query: listDriverSchemaType) => {
  const { page, perPage, search, sortOn, sortOrder, status } = query;

  //skip
  const skipQuery = (page - 1) * perPage;

  // prepare where obj
  let whereObj: Prisma.DriverWhereInput = {};

  if (search) {
    whereObj.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  // If status filter is there
  if (status) {
    whereObj = { ...whereObj, status };
  }

  //prepare sort obj
  const sortByObj: Prisma.DriverOrderByWithRelationInput = {
    [sortOn]: sortOrder,
  };

  const [drivers, totalCount] = await driverRepository.findManyWithCount({
    where: whereObj,
    orderBy: sortByObj,
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

export const getDriverByIdService = async (id: string) => {
  const existingDriver = await driverRepository.findUnique({ id });

  // TODO - add Driver detail with stats

  if (!existingDriver) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "No driver found");
  }

  return existingDriver;
};
export const updateDriverService = async (id: string, data: UpdateDriverSchemaType) => {

  const { status } = data;

  const existingDriver = await driverRepository.findUnique({ id });

  if (!existingDriver) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Driver not found");
  }

  const isStatusChanging = status !== undefined && status !== existingDriver.status;

  if (isStatusChanging) {
    if (existingDriver.status === DriverStatus.ON_TRIP) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        "Driver is on trip, status cannot be changed"
      );
    }

    if (status === DriverStatus.ON_TRIP) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        "Driver status cannot be manually set to ON_TRIP"
      );
    }
  }

  return await driverRepository.update({ id }, data);

};
export const deleteDriverService = async (id: string) => {
  const existingDriver = await driverRepository.findUnique({ id });

  // cannot delete a driver who is currently on a trip
  if (existingDriver?.status === DriverStatus.ON_TRIP) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "Driver is currently on a trip and cannot be deleted",
    );
  }

  const deletedDriver = await driverRepository.update(
    { id },
    { status: DriverStatus.SUSPENDED },
  );

  return deletedDriver;
};
