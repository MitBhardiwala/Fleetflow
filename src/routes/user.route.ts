import express from "express";
import { create, list, get, update, remove } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import {
  createUserSchema,
  getUserSchema,
  listUserQuerySchema,
  updateUserSchema,
} from "../utils/validations";

const router = express.Router();

router.post(
  "/",
  validate({
    body: createUserSchema,
  }),
  create,
);

router.get(
  "/",
  validate({
    query: listUserQuerySchema,
  }),
  list,
);

router.get("/:id", validate({ params: getUserSchema }), get);

router.patch("/:id", validate({ params: getUserSchema, body: updateUserSchema }), update);

router.delete("/:id", validate({ params: getUserSchema }), remove);

export default router;
