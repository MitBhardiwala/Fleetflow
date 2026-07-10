import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import driverRoutes from "./driver.route";
import vehicleRoutes from "./vehicle.route";
import tripRoutes from "./trip.route"

const router = express.Router();

//auth routes
router.use("/auth", authRoutes);

//user routes
router.use("/user", userRoutes);

//driver routes
router.use("/driver", driverRoutes);

//vehicle routes
router.use("/vehicle", vehicleRoutes);

//Trip routes
router.use("/trip",tripRoutes)

export default router;
