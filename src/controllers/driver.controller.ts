import { NextFunction, Request, Response } from "express";
import {
  CreateDriverSchemaType,
  listDriverSchemaType,
} from "../utils/validations";
import {
  createDriverService,
  getDriverByIdService,
  getDriverService,
} from "../services/driver.service";
import { STATUS_CODES } from "../utils/constants";

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
