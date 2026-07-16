import express from "express";
import { create, list, updateIncident } from "../controllers/incident.controller";
import { validate } from "../middleware/validate";
import { createIncidentSchema, getIncidentSchema, listIncidentSchema, updateIncidentSchema } from "../utils/validations";

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
