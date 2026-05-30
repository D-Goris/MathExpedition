// import gruposService from './grupos.service.js';

const gruposController = {};
const JAVA_API = 'http://localhost:8080/api/java/grupos';

gruposController.obtenerGrupos = async (req, res) => {
    try {
        const response = await fetch(JAVA_API);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

gruposController.crearGrupo = async (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) {
        return res.status(400).json({ success: false, message: 'Faltan campos (nombre o descripción).' });
    }

    try {
        const response = await fetch(JAVA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion })
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

gruposController.asignarAlumno = async (req, res) => {
    const { idGrupo } = req.params;
    const { idAlumno } = req.body;

    if (!idAlumno) {
        return res.status(400).json({ success: false, message: 'Se requiere el idAlumno' });
    }

    try {
        const response = await fetch(`${JAVA_API}/${idGrupo}/asignar-alumno`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idAlumno })
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

gruposController.removerAlumno = async (req, res) => {
    const { idGrupo } = req.params;
    const { idAlumno } = req.body;

    if (!idAlumno) {
        return res.status(400).json({ success: false, message: 'Se requiere el idAlumno' });
    }

    try {
        const response = await fetch(`${JAVA_API}/${idGrupo}/remover-alumno`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idAlumno })
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

gruposController.asignarMision = async (req, res) => {
    const { idGrupo } = req.params;
    const { idMision } = req.body;

    if (!idMision) {
        return res.status(400).json({ success: false, message: 'Se requiere el idMision' });
    }

    try {
        const response = await fetch(`${JAVA_API}/${idGrupo}/asignar-mision`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idMision })
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

export default gruposController;
