import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../db";

interface FindManyParams {
  where?: Prisma.FuelLogWhereInput;
  orderBy?: Prisma.FuelLogOrderByWithRelationInput;
  select?: Prisma.FuelLogSelect;
  include?: Prisma.FuelLogInclude;
  skip?: number;
  take?: number;
}

export const fuelLogRepository = {
  create: (data: Prisma.FuelLogUncheckedCreateInput) => {
    return prisma.fuelLog.create({ data });
  },
  findUnique: (where: Prisma.FuelLogWhereUniqueInput) => {
    return prisma.fuelLog.findUnique({ where });
  },
  findManyWithCount: ({ where, orderBy, include, skip, take }: FindManyParams) => {
    return prisma.$transaction([
      prisma.fuelLog.findMany({ where, orderBy, include, skip, take }),
      prisma.fuelLog.count({ where }),
    ]);
  },
};
