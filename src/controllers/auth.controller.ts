import { NextFunction, Request, Response } from "express";
import {
  forgotPasswordService,
  loginUserService,
} from "../services/auth.service.ts";
import { STATUS_CODES } from "../utils/constants.ts";
import { LoginUserSchemaType } from "../utils/validations.ts";

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
      message: "Login successful",
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
