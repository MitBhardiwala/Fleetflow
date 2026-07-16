import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../db";

interface FindManyParams {
  where?: Prisma.IncidentWhereInput;
  orderBy?: Prisma.IncidentOrderByWithRelationInput;
  select?: Prisma.IncidentSelect;
  include?: Prisma.IncidentInclude;
  skip?: number;
  take?: number;
}

export const incidentRepository = {
  create: (data: Prisma.IncidentUncheckedCreateInput) => {
    return prisma.incident.create({ data });
  },
  findUnique: (where: Prisma.IncidentWhereUniqueInput) => {
    return prisma.incident.findUnique({ where });
  },
  findManyWithCount: ({ where, orderBy, include, skip, take }: FindManyParams) => {
    return prisma.$transaction([
      prisma.incident.findMany({ where, orderBy, include, skip, take }),
      prisma.incident.count({ where }),
    ]);
  },
  update: (where: Prisma.IncidentWhereUniqueInput, data: Prisma.IncidentUncheckedUpdateInput) => {
    return prisma.incident.update({ where, data });
  },
};
