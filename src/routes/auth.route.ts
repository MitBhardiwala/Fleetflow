import express from "express";
import { validate } from "../middleware/validate.ts";
import { forgotPasswordSchema, loginUserSchema } from "../utils/validations.ts";
import { login, forgotPassword } from "../controllers/auth.controller.ts";

const router = express.Router();

router.post("/login", validate({ body: loginUserSchema }), login);
router.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  forgotPassword,
);
// TODO create verify password api
export default router;
