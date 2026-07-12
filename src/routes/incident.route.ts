import express from "express";
import { create, list } from "../controllers/incident.controller";
import { validate } from "../middleware/validate";
import { createIncidentSchema, listIncidentSchema } from "../utils/validations";

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

export default router;
