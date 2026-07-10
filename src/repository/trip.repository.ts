import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../db";

interface FindManyParams {
  where?: Prisma.TripWhereInput;
  orderBy?: Prisma.TripOrderByWithRelationInput;
  include?: Prisma.TripInclude;
  select?: Prisma.TripSelect;
  skip?: number;
  take?: number;
}

export const tripRepository = {
  create: (data: Prisma.TripUncheckedCreateInput) => {
    return prisma.trip.create({ data });
  },
  findMany: ({ where, orderBy, select, skip, take }: FindManyParams) => {
    return prisma.trip.findMany({
      where,
      orderBy,
      select,
      skip,
      take,
    });
  },
  count: (where: Prisma.TripWhereInput) => {
    return prisma.trip.count({ where });
  },
  findManyWithCount: ({
    where,
    orderBy,
    include,
    skip,
    take,
  }: FindManyParams) => {
    return prisma.$transaction([
      prisma.trip.findMany({ where, orderBy, include, skip, take }),
      prisma.trip.count({ where }),
    ]);
  },
};
