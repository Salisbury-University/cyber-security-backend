import express from "express";
import { ExerciseController } from "../http/controllers/ExerciseController";

const router = express.Router();
import validate from "../http/middleware/ValidationMiddleware";
import exerciseSchema from "../schema/ExerciseGetInfo";

router.get("/:id", validate(exerciseSchema), ExerciseController.getInfo);

export default router;
