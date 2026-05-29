import { Router } from 'express';
import maestrosController from './maestros.controller.js';

const maestrosRouter = Router();

// GET /api/maestros/:id - Obtener el perfil del profesor
maestrosRouter.get('/:id', maestrosController.obtenerPerfil);

export default maestrosRouter;
