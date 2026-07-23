import express from "express";
import { create, list, get, update, remove, getMe } from "../controllers/user.controller.ts";
import { validate } from "../middleware/validate.ts";
import {
  createUserSchema,
  getUserSchema,
  listUserQuerySchema,
  updateUserSchema,
} from "../utils/validations.ts";

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

router.get("/me", getMe);
router.get("/:id", validate({ params: getUserSchema }), get);

router.patch("/:id", validate({ params: getUserSchema, body: updateUserSchema }), update);

router.delete("/:id", validate({ params: getUserSchema }), remove);




export default router;
