import { Prisma } from "../../generated/prisma/client.ts";
import { prisma } from "../db.ts";

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
  findUnique: (where: Prisma.TripWhereUniqueInput) => {
    return prisma.trip.findUnique({ where });
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
    skip,
    include,
    take,
  }: FindManyParams) => {
    return prisma.$transaction([
      prisma.trip.findMany({ where, orderBy, skip, take, include }),
      prisma.trip.count({ where }),
    ]);
  },
  update: (where: Prisma.TripWhereUniqueInput, data: Prisma.TripUpdateInput) => {
    return prisma.trip.update({ where, data });
  },
};
