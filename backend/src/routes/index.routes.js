import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes.js';

const indexRouter = Router();

// Vincula las rutas de autenticación bajo el prefijo /auth
indexRouter.use('/auth', authRouter); // URL final: http://localhost:3000/api/auth/login

export default indexRouter;