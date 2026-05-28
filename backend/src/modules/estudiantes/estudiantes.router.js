import { Router } from 'express';
import estudiantesController from './estudiantes.controller.js';

const estudiantesRouter = Router();

estudiantesRouter.get('/', estudiantesController.obtenerEstudiantes);
estudiantesRouter.get('/:idEstudiante/misiones', estudiantesController.obtenerMisionesAsignadas);
estudiantesRouter.post('/:idEstudiante/avance', estudiantesController.guardarAvance);

export default estudiantesRouter;
