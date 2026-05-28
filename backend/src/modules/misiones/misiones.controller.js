// src/modules/misiones/misiones.controller.js
import misionesService from './misiones.service.js';

const misionesController = {};

misionesController.obtenerMisiones = (req, res) => {
    const misiones = misionesService.obtenerMisiones();
    return res.status(200).json(misiones);
};

misionesController.obtenerEjerciciosPorMision = (req, res) => {
    const { id } = req.params; // Este 'id' viene de la URL

    const ejercicios = misionesService.obtenerEjerciciosPorMision(id);

    if (!ejercicios) {
        return res.status(404).json({ msg: `No se encontró la misión con ID ${id}` });
    }

    return res.status(200).json(ejercicios);
};

misionesController.crearEjercicio = (req, res) => {
    const { id } = req.params; // Este es el ID de la misión desde la URL
    
    // Extraemos los datos que envía tu formulario del frontend
    const { pregunta, opA, opB, opC, opD, correcta } = req.body;

    // Validación de seguridad básica
    if (!pregunta || !opA || !opB || !opC || !opD || !correcta) {
        return res.status(400).json({ msg: 'Faltan campos obligatorios para crear el ejercicio' });
    }

    const resultado = misionesService.crearEjercicioEInyectar(id, req.body);

    if (resultado.error) {
        return res.status(404).json({ msg: resultado.error });
    }

    return res.status(201).json({ 
        msg: '¡Ejercicio creado e inyectado a la misión con éxito!', 
        ejercicio: resultado 
    });
};

export default misionesController;