import express from "express";

const router = express.Router();

import validate from "../http/middleware/ValidationMiddleware";
import searchSchema from "../schema/SearchGet";
import { SearchController } from "../http/controllers/SearchController";

router.get(
  "/exercises?search=:query",
  validate(searchSchema),
  SearchController.search
);

export default router;
