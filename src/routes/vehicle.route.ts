import express from "express";
import { validate } from "../middleware/validate.ts";
import {
  createVehicleSchema,
  getVehicleSchema,
  listVehicleSchema,
  updateVehicleSchema,
} from "../utils/validations.ts";
import { create, get, getById, remove, update } from "../controllers/vehicle.controller.ts";

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
router.patch(
  "/:id",
  validate({ params: getVehicleSchema, body: updateVehicleSchema }),
  update,
);
router.delete("/:id", validate({ params: getVehicleSchema }), remove);

export default router;
