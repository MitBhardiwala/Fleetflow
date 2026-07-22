import express from "express";
import { create, list, updateIncident } from "../controllers/incident.controller.ts";
import { validate } from "../middleware/validate.ts";
import { createIncidentSchema, getIncidentSchema, listIncidentSchema, updateIncidentSchema } from "../utils/validations.ts";

const router = express.Router();

router.post(
  "/",
  validate({
    body: createIncidentSchema,
  }),
  create,
);

router.get(
  "/",
  validate({
    query: listIncidentSchema,
  }),
  list,
);

router.patch(
  "/:id",
  validate({
    params: getIncidentSchema,
    body: updateIncidentSchema,
  }),
  updateIncident,
);

export default router;
