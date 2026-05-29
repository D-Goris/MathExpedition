import { Router } from 'express';
import authRouter from '../modules/auth/auth.router.js';
import misionesRouter from '../modules/misiones/misiones.router.js';
import gruposRouter from '../modules/grupos/grupos.router.js';
import estudiantesRouter from '../modules/estudiantes/estudiantes.router.js';
import maestrosRouter from '../modules/maestros/maestros.router.js';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/misiones', misionesRouter);
indexRouter.use('/grupos', gruposRouter);
indexRouter.use('/estudiantes', estudiantesRouter);
indexRouter.use('/maestros', maestrosRouter);

export default indexRouter;