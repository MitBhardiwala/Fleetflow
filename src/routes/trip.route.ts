import express from "express";
import { create, list } from "../controllers/trip.controller";
import { validate } from "../middleware/validate";
import { createTripSchema, listTripSchema } from "../utils/validations";

const router = express.Router();

router.get(
  "/",
  validate({
    query: listTripSchema,
  }),
  list,
);

router.post(
  "/",
  validate({
    body: createTripSchema,
  }),
  create,
);

export default router;
