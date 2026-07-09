import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../db";

interface FindManyParams {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
  select?: Prisma.UserSelect;
  skip?: number;
  take?: number;
}

export const userRepository = {
  findUnique: (where: Prisma.UserWhereUniqueInput) => {
    return prisma.user.findUnique({ where });
  },
  findMany: ({ where, orderBy, select, skip, take }: FindManyParams) => {
    return prisma.user.findMany({
      where,
      orderBy,
      select,
      skip,
      take,
    });
  },
  count: (where: Prisma.UserWhereInput) => {
    return prisma.user.count({ where });
  },
  findManyWithCount: ({
    where,
    orderBy,
    select,
    skip,
    take,
  }: FindManyParams) => {
    return prisma.$transaction([
      prisma.user.findMany({ where, orderBy, select, skip, take }),
      prisma.user.count({ where }),
    ]);
  },
  create: (data: Prisma.UserCreateInput) => {
    return prisma.user.create({ data });
  },
};
