import { Router } from 'express';
import authController from './auth.controller.js';

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/registrar-estudiante', authController.registrarEstudiante);
authRouter.post('/register-maestro', authController.registrarMaestro);

export default authRouter;