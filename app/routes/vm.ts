import express from "express";
import { ExerciseController } from "../http/controllers/ExerciseController";

const router = express.Router();

import validate from "../http/middleware/ValidationMiddleware";

import AuthMiddleware from "../http/middleware/AuthMiddleware";
import { VirtualMachineController } from "../http/controllers/VirtualMachineController";
router.use(AuthMiddleware);

router.get("/:id/terminate", VirtualMachineController.terminate);
router.get("/:id");

export default router;
