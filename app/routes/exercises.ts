import express from "express";

const router = express.Router();

import AuthMiddleware from "../http/middleware/AuthMiddleware";
router.use(AuthMiddleware);

import validate from "../http/middleware/ValidationMiddleware";
import schema from "../schema/ExercisesFetchPageGet";
import { ExercisesController } from "../http/controllers/ExercisesController";

router.get("/", ExercisesController.fetchList);
router.get("/:page", validate(schema), ExercisesController.fetchPage);

export default router;
