import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "./constants";

export class AppError extends Error {
  statusCode: number;

  constructor(
    statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
    message: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(err);

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // Any other error (including plain `new Error(...)`)
  // const message = err instanceof Error ? err.message : "Internal server error";
  const message = "Internal server error";
  res
    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: message });
};
