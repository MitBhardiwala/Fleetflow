import express from "express";
import { create, list, update } from "../controllers/fuel-log.controller.ts";
import { validate } from "../middleware/validate.ts";
import {
  createFuelLogSchema,
  getFuelLogSchema,
  listFuelLogSchema,
  updateFuelLogSchema,
} from "../utils/validations.ts";

const router = express.Router();

router.post(
  "/",
  validate({
    body: createFuelLogSchema,
  }),
  create,
);

router.get(
  "/",
  validate({
    query: listFuelLogSchema,
  }),
  list,
);

router.patch(
  "/:id",
  validate({
    params: getFuelLogSchema,
    body: updateFuelLogSchema,
  }),
  update,
);

export default router;
