import estudiantesService from './estudiantes.service.js';

const estudiantesController = {};

estudiantesController.obtenerEstudiantes = (req, res) => {
    const estudiantes = estudiantesService.obtenerEstudiantes();
    return res.status(200).json(estudiantes);
};

estudiantesController.obtenerMisionesAsignadas = (req, res) => {
    const { idEstudiante } = req.params;
    const resultado = estudiantesService.obtenerMisionesAsignadas(idEstudiante);
    
    if (resultado.error) {
        return res.status(404).json({ success: false, message: resultado.error });
    }
    
    return res.status(200).json({ success: true, misionesIds: resultado.misionesIds, grupo: resultado.grupo });
};

estudiantesController.guardarAvance = (req, res) => {
    const { idEstudiante } = req.params;
    const { idEjercicio } = req.body;

    if (!idEjercicio) {
        return res.status(400).json({ success: false, message: 'Falta el idEjercicio' });
    }

    const resultado = estudiantesService.guardarAvance(idEstudiante, idEjercicio);
    if (resultado.error) {
        return res.status(400).json({ success: false, message: resultado.error });
    }

    return res.status(200).json({ success: true, message: 'Avance guardado exitosamente' });
};

export default estudiantesController;
