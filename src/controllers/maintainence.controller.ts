import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../utils/constants";
import {
  createMaintenanceService,
  completeMaintenanceService,
  listMaintenanceService,
} from "../services/maintainence.service";
import {
  CompleteMaintenanceSchemaType,
  CreateMaintenanceSchemaType,
  ListMaintenanceSchemaType,
} from "../utils/validations";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createMaintenanceService(
      req.validatedBody as CreateMaintenanceSchemaType,
      req.user.userId,
    );

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Maintenance log created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await listMaintenanceService(
      req.validatedQuery as ListMaintenanceSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Maintenance log listed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const completeMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await completeMaintenanceService(
      req.validatedParams as CompleteMaintenanceSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Maintenance log marked as completed",
      data,
    });
  } catch (error) {
    next(error);
  }
};
