import { Router } from 'express';
import authRouter from '../modules/auth/auth.router.js';
//import ejerciciosRouter from './ejercicios.router.js';
import misionesRouter from '../modules/misiones/misiones.router.js';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);
//POST http://localhost:3000/api/auth/login (Para iniciar sesión)
//POST http://localhost:3000/api/auth/registrar-estudiante (Para crear alumnos en estudiantes.json)
// -> POST http://localhost:3000/api/auth/register-maestro (Para crear profesores en maestros.json)

//indexRouter.use('/juego', ejerciciosRouter); // <-- URL final: http://localhost:3000/api/juego/mision/1


indexRouter.use('/misiones', misionesRouter);
//GET http://localhost:3000/api/misiones (Devuelve el mapa/array de misiones desde misiones.json)
//GET http://localhost:3000/api/misiones/1/ejercicios (Devuelve los ejercicios narrativos detallados de la misión 1 desde ejercicios.json)
//POST http://localhost:3000/api/misiones/1/ejercicios (Crea un reto matemático y lo inyecta en la misión 1)


export default indexRouter;