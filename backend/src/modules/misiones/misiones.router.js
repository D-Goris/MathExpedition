// src/modules/misiones/misiones.routes.js
import { Router } from 'express';
import misionesController from './misiones.controller.js';

const misionesRouter = Router();

// GET /api/misiones -> Trae el array general de misiones
misionesRouter.get('/', misionesController.obtenerMisiones);

// POST /api/misiones -> Crea una nueva misión
misionesRouter.post('/', misionesController.crearMision);

// GET /api/misiones/:id/ejercicios -> Trae las preguntas de la misión indicada
misionesRouter.get('/:id/ejercicios', misionesController.obtenerEjerciciosPorMision);

// POST /api/misiones/:id/ejercicios -> Crea un ejercicio y lo inyecta en la misión
misionesRouter.post('/:id/ejercicios', misionesController.crearEjercicio);

export default misionesRouter;