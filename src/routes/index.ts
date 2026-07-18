import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import driverRoutes from "./driver.route";
import vehicleRoutes from "./vehicle.route";
import tripRoutes from "./trip.route";
import maintainenceRoutes from "./maintainence.route";
import fuelLogRoutes from "./fuel-log.route";
import incidentRoutes from "./incident.route";
import analyticsRoutes from "./analytics.route";
import { authenticateToken } from "../middleware/authenticate";

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
