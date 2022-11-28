/** Basic router example */

// Import express
import express from "express";

// Import route controller(s)
import { IndexController } from "../http/controllers/IndexController";

// import validation middleware
import validate from "../http/middleware/ValidationMiddleware";
import schema from "../schema/example";

// Create a router instance for our nested routes.
const router = express.Router();

// Assign routes to our router
router.get("/", IndexController.index);

// Example route for input validation that expects a JSON with a message string
router.post("/", validate(schema), IndexController.index);

// Nested router for authentication examples

// For authentication routes
import authRouter from "./auth";
router.use("/api/v1/auth", authRouter);

// For individual exercise routes
import exerciseRouter from "./exercise";
router.use("/api/v1/exercise", exerciseRouter);

// For all exercises routes
import exercisesRouter from "./exercises";
router.use("/api/v1/exercises", exercisesRouter);

// For user preference routes
import preferenceRouter from "./preference";
router.use("/api/v1/preference", preferenceRouter);

// For search routes
import searchRoute from "./search";
router.use("/api/v1/search", searchRoute);

// Export the router
export default router;
