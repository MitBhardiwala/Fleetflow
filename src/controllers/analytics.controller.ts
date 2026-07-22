import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../utils/constants.ts";
import {
  getDashboardStatsService,
  getFuelEfficiencyService,
  getVehicleROIService,
} from "../services/analytics.service.ts";


export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getDashboardStatsService();

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getFuelEfficiency = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getFuelEfficiencyService();

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Fuel efficiency fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicleROI = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getVehicleROIService();

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Vehicle ROI fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
