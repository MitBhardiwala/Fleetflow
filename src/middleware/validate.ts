import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { AppError } from "../utils/error";
import { STATUS_CODES } from "../utils/constants";

interface ValidationSchemas {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
}

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        req.validatedParams = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.validatedQuery = schemas.query.parse(req.query);
      }
      if (schemas.body) {
        req.validatedBody = schemas.body.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((e) => `${e.path.join(".") || "value"}: ${e.message}`)
          .join("; ");
        return next(new AppError(STATUS_CODES.BAD_REQUEST, message));
      }
      next(error);
    }
  };
