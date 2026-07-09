import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import driverRoutes from "./driver.route";
import vehicleRoutes from "./vehicle.route";

const router = express.Router();

//auth routes
router.use("/auth", authRoutes);

//user routes
router.use("/user", userRoutes);

//driver routes
router.use("/driver", driverRoutes);

//vehicle routes
router.use("/vehicle", vehicleRoutes);

export default router;
