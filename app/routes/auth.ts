import express from 'express';
import { AuthController } from '../http/controllers/AuthController';
import { IndexController } from '../http/controllers/IndexController';

const router = express.Router();

import AuthMiddleware from '../http/middleware/AuthMiddleware';
// Everywhere below here will require authentication.

router.post('/login', AuthController.login);
router.get('/', IndexController.index);

export default router;
