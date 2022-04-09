import express from 'express';
import { AuthController } from '../http/controllers/AuthController';
import { IndexController } from '../http/controllers/IndexController';

const router = express.Router();

//ValidationMiddleware
import validate from '../http/middleware/ValidationMiddleware';
import schema from '../schema/Auth';

router.use(validate(schema));

router.post('/login', AuthController.login);
router.get('/', IndexController.index);


export default router;
