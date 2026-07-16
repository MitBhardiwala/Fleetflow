import express from "express";
import {
  getDashboardStats,
  getFuelEfficiency,
  getVehicleROI,
} from "../controllers/analytics.controller";

const router = express.Router();

// GET /analytics/dashboard/stats
router.get("/dashboard/stats", getDashboardStats);

// GET /analytics/fuel-efficiency
router.get("/fuel-efficiency", getFuelEfficiency);

// GET /analytics/vehicle-roi
router.get("/vehicle-roi", getVehicleROI);

export default router;
