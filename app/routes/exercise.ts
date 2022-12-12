import express from "express";
import { ExerciseController } from "../http/controllers/ExerciseController";

const router = express.Router();

import validate from "../http/middleware/ValidationMiddleware";
import exerciseSchema from "../schema/ExerciseGetInfo";
import getVMSchema from "../schema/ExerciseGetStart";

// Get the exercise information
router.get("/:id", validate(exerciseSchema), ExerciseController.getInfo);
router.get("/status/weekly", ExerciseController.weeklyStatus);

import AuthMiddleware from "../http/middleware/AuthMiddleware";
router.use(AuthMiddleware);

// Getting status of the exercise
router.get(
  "/:id/status",
  validate(exerciseSchema),
  ExerciseController.getStatusRequest
);
router.post("/:id/status", ExerciseController.updateStatus);

// Starts the virtual machine
router.post("/:id/start", ExerciseController.requestVM);

export default router;
