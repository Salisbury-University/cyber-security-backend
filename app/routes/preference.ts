import express from "express";

const router = express.Router();

import validate from "../http/middleware/ValidationMiddleware";
import preference from "../schema/PreferencePostPost";

// Check for user is authenticated
import AuthMiddleware from "../http/middleware/AuthMiddleware";
router.use(AuthMiddleware);

import { PreferenceController } from "../http/controllers/PreferenceController";

// Insert preference to database
router.post("/", validate(preference), PreferenceController.post);

// Get the user preference from the database
router.get("/", PreferenceController.get);

export default router;
