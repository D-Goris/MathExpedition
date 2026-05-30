// src/modules/misiones/misiones.controller.js
// import misionesService from './misiones.service.js';

const misionesController = {};
const JAVA_API = 'http://localhost:8080/api/java/misiones';

misionesController.obtenerMisiones = async (req, res) => {
    try {
        const response = await fetch(JAVA_API);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

misionesController.obtenerEjerciciosPorMision = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`${JAVA_API}/${id}/ejercicios`);
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

misionesController.crearMision = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ msg: 'Se requiere el nombre de la misión' });
    }

    try {
        const response = await fetch(JAVA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

misionesController.crearEjercicio = async (req, res) => {
    const { id } = req.params;
    const { pregunta, opA, opB, opC, opD, correcta } = req.body;

    if (!pregunta || !opA || !opB || !opC || !opD || !correcta) {
        return res.status(400).json({ msg: 'Faltan campos obligatorios para crear el ejercicio' });
    }

    try {
        const response = await fetch(`${JAVA_API}/${id}/ejercicios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

export default misionesController;