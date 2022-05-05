import express from "express";

const router = express.Router();

import validate from "../http/middleware/ValidationMiddleware";
import preference from "../schema/PreferencePostPost";

import AuthMiddleware from "../http/middleware/AuthMiddleware";
router.use(AuthMiddleware);

import { PreferenceController } from "../http/controllers/PreferenceController";
router.post("/", validate(preference), PreferenceController.post);
router.get("/", PreferenceController.get);

export default router;
