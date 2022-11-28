import express from "express";
import { ExerciseController } from "../http/controllers/ExerciseController";

const router = express.Router();

import validate from "../http/middleware/ValidationMiddleware";
import exerciseSchema from "../schema/ExerciseGetInfo";
import noVNCSchema from "../schema/VirtualMachineNoVNC";

router.get("/:id", validate(exerciseSchema), ExerciseController.getInfo);

router.post("/novnc", validate(noVNCSchema), ExerciseController.noVNC);
export default router;
