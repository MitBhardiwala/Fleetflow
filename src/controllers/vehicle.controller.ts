import { NextFunction, Request, Response } from "express";
import {
  CreateVehicleSchemaType,
  GetVehicleSchemaType,
  ListVehicleSchemaType,
  UpdateVehicleSchemaType,
} from "../utils/validations";
import {
  createVehicleService,
  deleteVehicleService,
  getVehicleService,
  listVehicleService,
  updateVehicleService,
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
      message: "Vehicle created successfully",
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
      message: "Vehicles fetched successfully",
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
      message: "Vehicle fetched successfully",
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
    const { id } = req.validatedParams as GetVehicleSchemaType;
    const data = await updateVehicleService(
      id,
      req.validatedBody as UpdateVehicleSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Vehicle updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.validatedParams as GetVehicleSchemaType;
    const data = await deleteVehicleService(id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Vehicle deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
