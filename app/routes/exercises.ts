import express from "express";

const router = express.Router();

import validate from "../http/middleware/ValidationMiddleware";
import schema from "../schema/ExercisesFetchPageGet";
import { ExercisesController } from "../http/controllers/ExercisesController";

// Fetching all the list of exercise
router.get("/", ExercisesController.fetchList);

// Fetching all the list in pagination
router.get("/:page", validate(schema), ExercisesController.fetchPage);

export default router;
