import express from "express";
import { validate } from "../middleware/validate.ts";
import {
  createDriverSchema,
  getDriverSchema,
  listDriverSchema,
  updateDriverSchema,
} from "../utils/validations.ts";
import { create, get, getById, update, remove } from "../controllers/driver.controller.ts";

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
router.patch("/:id", validate({ params: getDriverSchema, body: updateDriverSchema }), update);

router.delete("/:id", validate({ params: getDriverSchema }), remove);

export default router;
