import { prisma } from "../db";
import { AppError } from "../utils/error";
import { SCORE_DEDUCTION, STATUS_CODES } from "../utils/constants";
import { CreateIncidentSchemaType, ListIncidentSchemaType } from "../utils/validations";
import { Prisma } from "../../generated/prisma/client";
import { incidentRepository } from "../repository/incident.repository";
import { driverRepository } from "../repository/driver.repository";
import { tripRepository } from "../repository/trip.repository";

export const createIncidentService = async (
  data: CreateIncidentSchemaType,
  createdBy: string,
) => {

  const { driverId, tripId, incidentType, severity, incidentDate } = data;

  // validate if driver exists
  const existingDriver = await driverRepository.findUnique({ id: driverId });

  if (!existingDriver) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Driver does not exist")
  }

  // if trip exists
  // validate if tripId is correct
  if (tripId) {
    const existingTrip = await tripRepository.findUnique({ id: tripId })

    if (!existingTrip) {
      throw new AppError(STATUS_CODES.NOT_FOUND, "Trip does not exist")
    }

    //validate if trip belongs to that driver or not
    if (existingTrip.driverId !== driverId) {
      throw new AppError(STATUS_CODES.CONFLICT, "Trip does not belong to driver")
    }
  }

  const scoreDeduction = SCORE_DEDUCTION[severity]

  // prepare incident object
  const incident = {
    driverId,
    ...(tripId !== undefined && { tripId: tripId }),
    incidentType,
    severity,
    scoreDeduction,
    incidentDate,
    createdBy
  }

  // Wrap incident create and driver update in transaction
  const [updateIncident] = await prisma.$transaction([
    incidentRepository.create(incident),
    driverRepository.update({ id: driverId }, { safetyScore: Math.max(0, Number(existingDriver.safetyScore) - scoreDeduction) })
  ])

  return updateIncident;

};

export const listIncidentsService = async (query: ListIncidentSchemaType) => {
  const { page, perPage, search, driverId, tripId, sortOn, sortOrder } = query;

  // skip
  const skipQuery = (page - 1) * perPage;

  // build where
  let whereObj: Prisma.IncidentWhereInput = {};

  if (search) {
    whereObj.driver = {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  if (driverId) {
    whereObj.driverId = driverId;
  }

  if (tripId) {
    whereObj.tripId = tripId;
  }

  // build orderBy
  let sortByObj: Prisma.IncidentOrderByWithRelationInput;

  switch (sortOn) {
    case "driver":
      sortByObj = { driver: { firstName: sortOrder } };
      break;
    case "incidentDate":
      sortByObj = { incidentDate: sortOrder };
      break;
    case "severity":
      sortByObj = { severity: sortOrder };
      break;
    default:
      sortByObj = { createdAt: sortOrder };
  }

  // build include
  const includeObj: Prisma.IncidentInclude = {
    driver: {
      select: { firstName: true, lastName: true },
    },
    trip: {
      select: { id: true },
    },
  };

  const [incidents, totalCount] = await incidentRepository.findManyWithCount({
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

  return { result: incidents, meta };
};
