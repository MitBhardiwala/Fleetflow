import express from "express";
import authRoutes from "./auth.route.ts";
import userRoutes from "./user.route.ts";
import driverRoutes from "./driver.route.ts";
import vehicleRoutes from "./vehicle.route.ts";
import tripRoutes from "./trip.route.ts";
import maintainenceRoutes from "./maintainence.route.ts";
import fuelLogRoutes from "./fuel-log.route.ts";
import incidentRoutes from "./incident.route.ts";
import analyticsRoutes from "./analytics.route.ts";
import { authenticateToken } from "../middleware/authenticate.ts";

const router = express.Router();

//auth routes
router.use("/auth", authRoutes);

router.use(authenticateToken);

//user routes
router.use("/user", userRoutes);

//driver routes
router.use("/driver", driverRoutes);

//vehicle routes
router.use("/vehicle", vehicleRoutes);

//Trip routes
router.use("/trip", tripRoutes);

//Maintenance routes
router.use("/maintenance", maintainenceRoutes);

//Fuel Log routes
router.use("/fuel-logs", fuelLogRoutes);

//Incident routes
router.use("/incidents", incidentRoutes);

//Analytics routes
router.use("/analytics", analyticsRoutes);

export default router;
