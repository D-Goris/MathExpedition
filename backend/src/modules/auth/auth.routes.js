// src/modules/auth/auth.routes.js
import { Router } from 'express';
import authController from './auth.controller.js';

const authRouter = Router();

authRouter.post('/login', authController.login);

export default authRouter;