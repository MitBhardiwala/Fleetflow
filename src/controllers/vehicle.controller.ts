import { NextFunction, Request, Response } from "express";
import { CreateVehicleSchemaType } from "../utils/validations";
import { creacreateVehicleServicete } from "../services/vehicle.service";
import { STATUS_CODES } from "../utils/constants";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await creacreateVehicleServicete(
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
