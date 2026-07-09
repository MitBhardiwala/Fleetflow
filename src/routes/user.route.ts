import express from "express";
import { create, list, get } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import {
  createUserSchema,
  getUserSchema,
  listUserQuerySchema,
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
export default router;
