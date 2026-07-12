import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../utils/constants";
import { createIncidentService, listIncidentsService } from "../services/incident.service";
import { CreateIncidentSchemaType, ListIncidentSchemaType } from "../utils/validations";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createIncidentService(
      req.validatedBody as CreateIncidentSchemaType,
      req.user.userId,
    );

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Incident created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await listIncidentsService(
      req.validatedQuery as ListIncidentSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Incidents listed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
