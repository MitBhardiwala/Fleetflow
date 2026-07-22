import { NextFunction, Request, Response } from "express";
import {
  CreateDriverSchemaType,
  listDriverSchemaType,
  UpdateDriverSchemaType,
} from "../utils/validations.ts";
import {
  createDriverService,
  getDriverByIdService,
  getDriverService,
  updateDriverService,
  deleteDriverService,
} from "../services/driver.service.ts";
import { STATUS_CODES } from "../utils/constants.ts";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createDriverService(
      req.validatedBody as CreateDriverSchemaType,
    );

    res.status(STATUS_CODES.CREATED).json({
      succes: true,
      message: "Driver created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getDriverService(
      req.validatedQuery as listDriverSchemaType,
    );

    res.status(STATUS_CODES.OK).json({
      succes: true,
      message: "Drivers fetched successfully",
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
    const { id } = req.validatedParams as { id: string };

    const data = await getDriverByIdService(id);

    res.status(STATUS_CODES.OK).json({
      succes: true,
      message: "Driver data fetched successfully",
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
    const { id } = req.validatedParams as { id: string };

    const data = await updateDriverService(id, req.validatedBody as UpdateDriverSchemaType);

    res.status(STATUS_CODES.OK).json({
      succes: true,
      message: "Driver updated fetched successfully",
      data,
    });
  } catch (error) {
    next(error)
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.validatedParams as { id: string };

    const data = await deleteDriverService(id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Driver deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
