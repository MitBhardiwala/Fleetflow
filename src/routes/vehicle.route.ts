import express from "express";
import { validate } from "../middleware/validate";
import {
  createVehicleSchema,
  getVehicleSchema,
  listVehicleSchema,
} from "../utils/validations";
import { create, get, getById } from "../controllers/vehicle.controller";

const router = express.Router();

router.post(
  "/",
  validate({
    body: createVehicleSchema,
  }),
  create,
);

router.get(
  "/",
  validate({
    query: listVehicleSchema,
  }),
  get,
);

router.get("/:id", validate({ params: getVehicleSchema }), getById);

export default router;
