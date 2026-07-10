import express from "express";
import { create, list } from "../controllers/fuel-log.controller";
import { validate } from "../middleware/validate";
import { createFuelLogSchema, listFuelLogSchema } from "../utils/validations";

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

export default router;
