import express from "express";
import { ExcerciseController } from "../http/controllers/ExerciseController";

const router = express.Router();

import AuthMiddleware from "../http/middleware/AuthMiddleware";
router.use(AuthMiddleware);

router.get("/:id/start", ExcerciseController.requestVM);

export default router;
