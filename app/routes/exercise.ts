import express from "express";
import { ExerciseController } from "../http/controllers/ExerciseController";

const router = express.Router();

//import AuthMiddleware from '../http/middleware/AuthMiddleware';
//router.use('/api/v1/auth', AuthMiddleware);

import validate from "../http/middleware/ValidationMiddleware";
import exerciseSchema from "../schema/ExerciseGetInfo";

router.get("/:id", validate(exerciseSchema), ExerciseController.getInfo);

export default router;
