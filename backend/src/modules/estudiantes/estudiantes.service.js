import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rutaEstudiantes = path.join(__dirname, '../../data/estudiantes.json');
const rutaGrupos = path.join(__dirname, '../../data/grupos.json');

const estudiantesService = {};

estudiantesService.obtenerEstudiantes = () => {
    const estudiantes = JSON.parse(fs.readFileSync(rutaEstudiantes, 'utf-8'));
    const grupos = JSON.parse(fs.readFileSync(rutaGrupos, 'utf-8'));
    return estudiantes.map(est => {
        const estSeguro = {
            idUsuario: est._idUsuario || est.idUsuario,
            name: est.name,
            nombreCompleto: est.nombreCompleto,
            ejerciciosResueltos: est.ejerciciosResueltos,
            registrosAvance: est.registrosAvance
        };
        
        // Find if this student is in any group
        const grupoAsignado = grupos.find(g => g.estudiantesIds && g.estudiantesIds.includes(estSeguro.idUsuario));
        estSeguro.grupo = grupoAsignado ? grupoAsignado.nombre : "";
        estSeguro.grupoKey = grupoAsignado ? grupoAsignado.idGrupo : "";

        return estSeguro;
    });
};

estudiantesService.obtenerMisionesAsignadas = (idEstudiante) => {
    const grupos = JSON.parse(fs.readFileSync(rutaGrupos, 'utf-8'));
    const grupoAsignado = grupos.find(g => g.estudiantesIds && g.estudiantesIds.includes(idEstudiante));

    if (!grupoAsignado) {
        return { error: 'El estudiante no está asignado a ningún grupo' };
    }

    return { misionesIds: grupoAsignado.misionesIds || [], grupo: grupoAsignado.nombre };
};

estudiantesService.guardarAvance = (idEstudiante, idEjercicio) => {
    const estudiantes = JSON.parse(fs.readFileSync(rutaEstudiantes, 'utf-8'));
    const estudianteEncontrado = estudiantes.find(e => (e._idUsuario || e.idUsuario) === idEstudiante);

    if (!estudianteEncontrado) {
        return { error: 'Estudiante no encontrado' };
    }

    if (!estudianteEncontrado.ejerciciosResueltos) {
        estudianteEncontrado.ejerciciosResueltos = [];
    }

    // Only add if not already solved
    if (!estudianteEncontrado.ejerciciosResueltos.includes(Number(idEjercicio))) {
        estudianteEncontrado.ejerciciosResueltos.push(Number(idEjercicio));
    }

    fs.writeFileSync(rutaEstudiantes, JSON.stringify(estudiantes, null, 2), 'utf-8');
    return estudianteEncontrado;
};

export default estudiantesService;
