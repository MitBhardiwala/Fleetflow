import { Prisma } from "../../generated/prisma/client.ts";
import { prisma } from "../db.ts";

interface FindManyParams {
  where?: Prisma.VehicleWhereInput;
  orderBy?: Prisma.VehicleOrderByWithRelationInput;
  select?: Prisma.VehicleSelect;
  skip?: number;
  take?: number;
}

export const vehicleRepository = {
  findUnique: (where: Prisma.VehicleWhereUniqueInput) => {
    return prisma.vehicle.findUnique({ where });
  },
  findMany: ({ where, orderBy, select, skip, take }: FindManyParams) => {
    return prisma.vehicle.findMany({
      where,
      orderBy,
      select,
      skip,
      take,
    });
  },
  count: (where: Prisma.VehicleWhereInput) => {
    return prisma.vehicle.count({ where });
  },
  findManyWithCount: ({
    where,
    orderBy,
    select,
    skip,
    take,
  }: FindManyParams) => {
    return prisma.$transaction([
      prisma.vehicle.findMany({ where, orderBy, select, skip, take }),
      prisma.vehicle.count({ where }),
    ]);
  },
  create: (data: Prisma.VehicleCreateInput) => {
    return prisma.vehicle.create({ data });
  },
  update: (
    where: Prisma.VehicleWhereUniqueInput,
    data: Prisma.VehicleUpdateInput,
  ) => {
    return prisma.vehicle.update({ where, data });
  },
};
