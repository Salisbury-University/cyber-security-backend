import express from "express";

const router = express.Router();

// Import authMiddleware for use login checking
import AuthMiddleware from "../http/middleware/AuthMiddleware";
// Import virutal machine controller
import { VirtualMachineController } from "../http/controllers/VirtualMachineController";

router.use(AuthMiddleware);
router.get("/:id", VirtualMachineController.getVM);

export default router;
