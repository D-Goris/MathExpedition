// import estudiantesService from './estudiantes.service.js';

const estudiantesController = {};
const JAVA_API = 'http://localhost:8080/api/java/estudiantes';

estudiantesController.obtenerEstudiantes = async (req, res) => {
    try {
        const response = await fetch(JAVA_API);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

estudiantesController.obtenerMisionesAsignadas = async (req, res) => {
    try {
        const { idEstudiante } = req.params;
        const response = await fetch(`${JAVA_API}/${idEstudiante}/misiones`);
        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

estudiantesController.guardarAvance = async (req, res) => {
    try {
        const { idEstudiante } = req.params;
        const { idEjercicio } = req.body;

        if (!idEjercicio) {
            return res.status(400).json({ success: false, message: 'Falta el idEjercicio' });
        }

        const response = await fetch(`${JAVA_API}/${idEstudiante}/avance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idEjercicio })
        });
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

export default estudiantesController;
