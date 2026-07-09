import express from "express";
import { validate } from "../middleware/validate";
import { createVehicleSchema } from "../utils/validations";
import { create } from "../controllers/vehicle.controller";

const router = express.Router();

router.post(
  "/",
  validate({
    body: createVehicleSchema,
  }),
  create,
);

export default router;
