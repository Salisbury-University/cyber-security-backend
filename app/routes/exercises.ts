import express from "express";

const router = express.Router();

import AuthMiddleware from "../http/middleware/AuthMiddleware";
router.use(AuthMiddleware);

import { ExercisesController } from "../http/controllers/ExercisesController";
router.get("/", ExercisesController.fetchList);

export default router;
