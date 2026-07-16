import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../utils/constants";
import { createIncidentService, listIncidentsService, updateIncidentService } from "../services/incident.service";
import { CreateIncidentSchemaType, GetIncidentSchemaType, ListIncidentSchemaType, UpdateIncidentSchemaType } from "../utils/validations";

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

export const updateIncident = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.validatedParams as GetIncidentSchemaType;
    const data = await updateIncidentService(
      id,
      req.validatedBody as UpdateIncidentSchemaType,
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Incident updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
