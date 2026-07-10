import express from "express";
import { create, list, completeMaintenance } from "../controllers/maintainence.controller";
import { validate } from "../middleware/validate";
import {
  createMaintenanceSchema,
  completeMaintenanceSchema,
  listMaintainanceSchema,
} from "../utils/validations";

const router = express.Router();

router.post(
  "/",
  validate({
    body: createMaintenanceSchema,
  }),
  create,
);
router.get(
  "/",
  validate({
    query: listMaintainanceSchema,
  }),
  list,
);

router.patch(
  "/:id/complete",
  validate({
    params: completeMaintenanceSchema,
  }),
  completeMaintenance,
);

export default router;
