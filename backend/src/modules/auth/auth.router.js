// src/modules/auth/auth.router.js
import { Router } from 'express';
import authController from './auth.controller.js';

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/registrar-estudiante', authController.registrarEstudiante);

// CORRECCIÓN CLAVE: Cambiamos '/registrar-maestro' por '/register-maestro'
// Ahora coincide al 100% con la línea: fetch(`${API_BASE}/auth/register-maestro`, ...) de tu Frontend
authRouter.post('/register-maestro', authController.registrarMaestro);

export default authRouter;