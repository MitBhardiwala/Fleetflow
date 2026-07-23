import { NextFunction, Request, Response } from "express";
import { createuser, getUser, listUser, updateUserService, deleteUserService } from "../services/user.services.ts";
import { STATUS_CODES } from "../utils/constants.ts";
import {
  CreateUserSchemaType,
  ListUserQuerySchemaType,
  UpdateUserSchemaType,
} from "../utils/validations.ts";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newUser = await createuser(req.validatedBody as CreateUserSchemaType);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await listUser(req.validatedQuery as ListUserQuerySchemaType);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "User listed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.validatedParams as { id: string };

    const data = await getUser(id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "User data fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.validatedParams as { id: string };

    const data = await updateUserService(id, req.validatedBody as UpdateUserSchemaType);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "User data updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.validatedParams as { id: string };

    const data = await deleteUserService(id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "User deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const data = await getUser(req.user.userId);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "User fetched successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
