import { Request, Response, NextFunction } from "express";
import { STATUS_CODES, UNIQUE_FIELD_MESSAGES } from "./constants";
import { Prisma } from "../../generated/prisma/client";
import { extractUniqueFields } from "./utils";


export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(
    statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    this.details = details
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

function fromPrismaError(err: Prisma.PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case "P2002": {


      const fields = extractUniqueFields(err);

      const message =
        fields.map((f) => UNIQUE_FIELD_MESSAGES[f]).find(Boolean) ??
        `Duplicate value for: ${fields.join(", ") || "unknown field"}`;

      return new AppError(STATUS_CODES.CONFLICT, message);

    }

    case "P2025":
      return new AppError(STATUS_CODES.NOT_FOUND, "Record not found.");


    default:
      return new AppError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        "Database error.",
      );
  }
}


export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(err);

  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = fromPrismaError(err);
  }

  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({
        success: false, message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
  }

  // Any other error (including plain `new Error(...)`)
  // const message = err instanceof Error ? err.message : "Internal server error";
  const message = "Internal server error";
  res
    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: message });
};
