import { Prisma } from "../../generated/prisma/client";
import {
  DriverCreateInput,
  DriverWhereUniqueInput,
} from "../../generated/prisma/models";
import { prisma } from "../db";

interface FindManyParams {
  where?: Prisma.DriverWhereInput;
  orderBy?: Prisma.DriverOrderByWithRelationInput;
  select?: Prisma.DriverSelect;
  skip?: number;
  take?: number;
}

export const driverRepository = {
  create: (data: DriverCreateInput) => {
    return prisma.driver.create({ data });
  },
  findUnique: async (where: DriverWhereUniqueInput) => {
    return prisma.driver.findUnique({ where });
  },
  findMany: ({ where, orderBy, select, skip, take }: FindManyParams) => {
    return prisma.driver.findMany({
      where,
      orderBy,
      select,
      skip,
      take,
    });
  },
  count: (where: Prisma.DriverWhereInput) => {
    return prisma.driver.count({ where });
  },
  findManyWithCount: ({
    where,
    orderBy,
    select,
    skip,
    take,
  }: FindManyParams) => {
    return prisma.$transaction([
      prisma.driver.findMany({ where, orderBy, select, skip, take }),
      prisma.driver.count({ where }),
    ]);
  },
};
