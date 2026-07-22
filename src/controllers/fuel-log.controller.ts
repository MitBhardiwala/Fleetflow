import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../utils/constants.ts";
import {
  createFuelLogService,
  listFuelLogsService,
  updateFuelLogService,
} from "../services/fuel-log.service.ts";
import {
  CreateFuelLogSchemaType,
  GetFuelLogSchemaType,
  ListFuelLogSchemaType,
  UpdateFuelLogSchemaType,
} from "../utils/validations.ts";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createFuelLogService(
      req.validatedBody as CreateFuelLogSchemaType,
      req.user.userId,
    );

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Fuel log created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await listFuelLogsService(
      req.validatedQuery as ListFuelLogSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Fuel logs listed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.validatedParams as GetFuelLogSchemaType;
    const data = await updateFuelLogService(
      id,
      req.validatedBody as UpdateFuelLogSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Fuel log updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
