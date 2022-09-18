import express from "express";
import { AuthController } from "../http/controllers/AuthController";
import { IndexController } from "../http/controllers/IndexController";

const router = express.Router();

//ValidationMiddleware
import validate from "../http/middleware/ValidationMiddleware";
import loginSchema from "../schema/AuthLoginPost";

router.post("/login", validate(loginSchema), AuthController.login);
router.get("/", IndexController.index);

export default router;
