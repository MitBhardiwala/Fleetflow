import express from "express";
import {
  create,
  cancelTripById,
  dispatch,
  dispatchTripById,
  completeTripById,
  list,
} from "../controllers/trip.controller";
import { validate } from "../middleware/validate";
import {
  createTripSchema,
  cancelTripSchema,
  completeTripSchema,
  dispatchTripSchema,
  getTripSchema,
  listTripSchema,
} from "../utils/validations";

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

router.post(
  "/dispatch",
  validate({
    body: dispatchTripSchema,
  }),
  dispatch,
);
router.put(
  "/:id/dispatch",
  validate({
    params: getTripSchema,
    body: dispatchTripSchema,
  }),
  dispatchTripById,
);

router.put(
  "/:id/complete",
  validate({
    params: getTripSchema,
    body: completeTripSchema,
  }),
  completeTripById,
);

router.put(
  "/:id/cancel",
  validate({
    params: getTripSchema,
    body: cancelTripSchema,
  }),
  cancelTripById,
);

export default router;
