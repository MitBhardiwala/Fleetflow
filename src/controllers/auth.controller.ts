import { NextFunction, Request, Response } from "express";
import {
  forgotPasswordService,
  loginUserService,
} from "../services/auth.service";
import { STATUS_CODES } from "../utils/constants";
import { LoginUserSchemaType } from "../utils/validations";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await loginUserService(
      req.validatedBody as LoginUserSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "User logged in successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.validatedBody as { email: string };

    const data = await forgotPasswordService(email);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "OTP has been sent to your email successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
