import { Router } from 'express';
import controller from '../controllers/Controller.js'; 

const ejerciciosRouter = Router();

// Rutas que tu compañero quería añadir:
ejerciciosRouter.get('/ejercicio/:id', (req, res) => res.send('Conseguir ejercicio'));
ejerciciosRouter.get('/mision/:id', (req, res) => res.send('Cargar ejercicios de misión'));

export default ejerciciosRouter;