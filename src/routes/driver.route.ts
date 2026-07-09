import express from "express";
import { validate } from "../middleware/validate";
import {
  createDriverSchema,
  getDriverSchema,
  listDriverSchema,
} from "../utils/validations";
import { create, get, getById } from "../controllers/driver.controller";

const router = express.Router();

router.post(
  "/",
  validate({
    body: createDriverSchema,
  }),
  create,
);

router.get(
  "/",
  validate({
    query: listDriverSchema,
  }),
  get,
);

router.get("/:id", validate({ params: getDriverSchema }), getById);

export default router;
