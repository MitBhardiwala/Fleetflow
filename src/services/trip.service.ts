import { tripRepository } from "../repository/trip.repository";
import { CreateTripSchemaType, ListTripSchemaType } from "../utils/validations";
import { validateTripCreation } from "../utils/trip.validations";
import { Prisma } from "../../generated/prisma/client";
import { TripInclude } from "../../generated/prisma/models";

export const createTripService = async (data: CreateTripSchemaType) => {
  const { vehicleId, driverId } = data;

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
    whereObj.OR = [...(whereObj.OR ?? []), { status }];
  }

  //prepare sort obj
  const sortByObj: Prisma.TripOrderByWithRelationInput = {
    [sortOn]: sortOrder,
  };

  //prepate include object
  const includeObj: TripInclude = {
    vehicle: true,
    driver: true,
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
