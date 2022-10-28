import express from "express";
import { ExerciseController } from "../http/controllers/ExerciseController";

const router = express.Router();

import AuthMiddleware from "../http/middleware/AuthMiddleware";
router.use("/api/v1/auth", AuthMiddleware);

import validate from "../http/middleware/ValidationMiddleware";
import exerciseSchema from "../schema/ExerciseGetInfo";
import getVMSchema from "../schema/ExerciseGetStart";

// Gets the content and metadata of exercise
router.get("/:id", validate(exerciseSchema), ExerciseController.getInfo);

// Gets the status of the exercise
router.get(
  "/:id/status",
  validate(exerciseSchema),
  ExerciseController.getConst
);

// Starts the virtual machine
router.post("/:id/start", validate(getVMSchema), ExerciseController.requestVM);

export default router;
