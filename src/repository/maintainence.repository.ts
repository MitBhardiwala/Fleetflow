import { Prisma } from "../../generated/prisma/client.ts";
import { prisma } from "../db.ts";

interface FindManyParams {
  where?: Prisma.MaintenanceRecordWhereInput;
  orderBy?: Prisma.MaintenanceRecordOrderByWithRelationInput;
  select?: Prisma.MaintenanceRecordSelect;
  include?: Prisma.MaintenanceRecordInclude;
  skip?: number;
  take?: number;
}

export const maintainenceRepository = {
  create: (data: Prisma.MaintenanceRecordUncheckedCreateInput) => {
    return prisma.maintenanceRecord.create({ data });
  },
  findUnique: (where: Prisma.MaintenanceRecordWhereUniqueInput) => {
    return prisma.maintenanceRecord.findUnique({ where });
  },
  update: (
    where: Prisma.MaintenanceRecordWhereUniqueInput,
    data: Prisma.MaintenanceRecordUncheckedUpdateInput,
  ) => {
    return prisma.maintenanceRecord.update({ where, data });
  },
  findManyWithCount: ({
    where,
    orderBy,
    include,
    skip,
    take,
  }: FindManyParams) => {
    return prisma.$transaction([
      prisma.maintenanceRecord.findMany({
        where,
        orderBy,
        include,
        skip,
        take,
      }),
      prisma.maintenanceRecord.count({ where }),
    ]);
  },
};
