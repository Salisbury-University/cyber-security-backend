import express from "express";

const router = express.Router();

// Query validation
import validate from "../http/middleware/ValidationMiddleware";
import searchSchema from "../schema/SearchGet";
import { SearchController } from "../http/controllers/SearchController";

// Requires query search (searches through exercises)
router.get("/exercises", validate(searchSchema), SearchController.search);

export default router;
