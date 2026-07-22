import { Prisma } from "../../generated/prisma/client.ts";

import { prisma } from "../db.ts";

interface FindManyParams {
  where?: Prisma.DriverWhereInput;
  orderBy?: Prisma.DriverOrderByWithRelationInput;
  select?: Prisma.DriverSelect;
  skip?: number;
  take?: number;
}

export const driverRepository = {
  create: (data: Prisma.DriverCreateInput) => {
    return prisma.driver.create({ data });
  },
  findFirst: (where: Prisma.DriverWhereInput) => {
    return prisma.driver.findFirst({ where });
  },
  findUnique: async (where: Prisma.DriverWhereUniqueInput) => {
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
  update: (
    where: Prisma.DriverWhereUniqueInput,
    data: Prisma.DriverUpdateInput,
  ) => {
    return prisma.driver.update({ where, data });
  },
};
