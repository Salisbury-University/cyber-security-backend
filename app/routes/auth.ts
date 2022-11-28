import express from "express";
import { AuthController } from "../http/controllers/AuthController";

const router = express.Router();

//ValidationMiddleware
import validate from "../http/middleware/ValidationMiddleware";
import loginSchema from "../schema/AuthLoginPost";

// Login route
router.post("/login", validate(loginSchema), AuthController.Login);

export default router;
