import { Router } from 'express';
import gruposController from './grupos.controller.js';

const gruposRouter = Router();

gruposRouter.get('/', gruposController.obtenerGrupos);
gruposRouter.post('/', gruposController.crearGrupo);
gruposRouter.put('/:idGrupo/asignar-alumno', gruposController.asignarAlumno);
gruposRouter.put('/:idGrupo/remover-alumno', gruposController.removerAlumno);
gruposRouter.put('/:idGrupo/asignar-mision', gruposController.asignarMision);

export default gruposRouter;
