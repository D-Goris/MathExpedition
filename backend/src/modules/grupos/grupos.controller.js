import gruposService from './grupos.service.js';

const gruposController = {};

gruposController.obtenerGrupos = (req, res) => {
    const grupos = gruposService.obtenerGrupos();
    return res.status(200).json(grupos);
};

gruposController.crearGrupo = (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) {
        return res.status(400).json({ success: false, message: 'Faltan campos (nombre o descripción).' });
    }

    const resultado = gruposService.crearGrupo(nombre, descripcion);
    if (resultado.error) {
        return res.status(400).json({ success: false, message: resultado.error });
    }

    return res.status(201).json({ success: true, message: 'Grupo creado', grupo: resultado });
};

gruposController.asignarAlumno = (req, res) => {
    const { idGrupo } = req.params;
    const { idAlumno } = req.body;

    if (!idAlumno) {
        return res.status(400).json({ success: false, message: 'Se requiere el idAlumno' });
    }

    const resultado = gruposService.asignarAlumno(idGrupo, idAlumno);
    if (resultado.error) {
        return res.status(400).json({ success: false, message: resultado.error });
    }

    return res.status(200).json({ success: true, message: 'Alumno asignado correctamente' });
};

gruposController.removerAlumno = (req, res) => {
    const { idGrupo } = req.params;
    const { idAlumno } = req.body;

    if (!idAlumno) {
        return res.status(400).json({ success: false, message: 'Se requiere el idAlumno' });
    }

    const resultado = gruposService.removerAlumno(idGrupo, idAlumno);
    if (resultado.error) {
        return res.status(400).json({ success: false, message: resultado.error });
    }

    return res.status(200).json({ success: true, message: 'Alumno removido correctamente' });
};

gruposController.asignarMision = (req, res) => {
    const { idGrupo } = req.params;
    const { idMision } = req.body;

    if (!idMision) {
        return res.status(400).json({ success: false, message: 'Se requiere el idMision' });
    }

    const resultado = gruposService.asignarMision(idGrupo, idMision);
    if (resultado.error) {
        return res.status(400).json({ success: false, message: resultado.error });
    }

    return res.status(200).json({ success: true, message: 'Misión asignada correctamente' });
};

export default gruposController;
