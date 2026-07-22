import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../utils/constants.ts";
import {
  cancelTripService,
  completeTripService,
  createTripService,
  dispatchTripService,
  listTripService,
} from "../services/trip.service.ts";
import {
  CompleteTripSchemaType,
  CancelTripSchemaType,
  CreateTripSchemaType,
  DispatchTripSchemaType,
  ListTripSchemaType,
} from "../utils/validations.ts";

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
export const dispatch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await dispatchTripService(
      req.validatedBody as DispatchTripSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Trips dispatched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const dispatchTripById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const data = await dispatchTripService(
      req.validatedBody as DispatchTripSchemaType,
      id as string,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Trips dispatched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const completeTripById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const data = await completeTripService(
      req.validatedBody as CompleteTripSchemaType,
      id as string,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Trip completed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelTripById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const data = await cancelTripService(
      id as string,
      req.validatedBody as CancelTripSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Trip cancelled successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
