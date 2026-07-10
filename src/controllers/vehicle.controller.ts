import { NextFunction, Request, Response } from "express";
import {
  CreateVehicleSchemaType,
  GetVehicleSchemaType,
  ListVehicleSchemaType,
} from "../utils/validations";
import {
  createVehicleService,
  getVehicleService,
  listVehicleService,
} from "../services/vehicle.service";
import { STATUS_CODES } from "../utils/constants";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createVehicleService(
      req.validatedBody as CreateVehicleSchemaType,
    );

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "vehicle created",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await listVehicleService(
      req.validatedQuery as ListVehicleSchemaType,
    );

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "vehicle listed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.validatedParams as GetVehicleSchemaType;

    const data = await getVehicleService(id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Vehicle data fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
