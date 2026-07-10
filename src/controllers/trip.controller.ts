import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../utils/constants";
import { createTripService, listTripService } from "../services/trip.service";
import {
  CreateTripSchemaType,
  ListTripSchemaType,
} from "../utils/validations";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createTripService(
      req.validatedBody as CreateTripSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Trip created as draft successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await listTripService(
      req.validatedQuery as ListTripSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Trips fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
