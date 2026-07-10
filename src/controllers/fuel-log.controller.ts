import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../utils/constants";
import { createFuelLogService, listFuelLogsService } from "../services/fuel-log.service";
import { CreateFuelLogSchemaType, ListFuelLogSchemaType } from "../utils/validations";

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
