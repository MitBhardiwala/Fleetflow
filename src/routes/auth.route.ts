import express from "express";
import { validate } from "../middleware/validate";
import { forgotPasswordSchema, loginUserSchema } from "../utils/validations";
import { login,forgotPassword } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", validate({ body: loginUserSchema }), login);
router.post("/forgot-password", validate({ body: forgotPasswordSchema }), forgotPassword);
// TODO create verify password api
export default router;
