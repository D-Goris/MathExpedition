import * as repoEstudiantes from '../../repository/repository.estudiantes.js';
import * as repoGrupos from '../../repository/repository.grupos.js';

const estudiantesService = {};

estudiantesService.obtenerEstudiantes = () => {
    const estudiantes = repoEstudiantes.obtenerTodos();
    const grupos = repoGrupos.obtenerTodos();
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
    const grupos = repoGrupos.obtenerTodos();
    const grupoAsignado = grupos.find(g => g.estudiantesIds && g.estudiantesIds.includes(idEstudiante));

    if (!grupoAsignado) {
        return { error: 'El estudiante no está asignado a ningún grupo' };
    }

    return { misionesIds: grupoAsignado.misionesIds || [], grupo: grupoAsignado.nombre };
};

estudiantesService.guardarAvance = (idEstudiante, idEjercicio) => {
    const estudianteEncontrado = repoEstudiantes.obtenerPorId(idEstudiante);

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

    repoEstudiantes.actualizarEstudiante(idEstudiante, { ejerciciosResueltos: estudianteEncontrado.ejerciciosResueltos });
    return estudianteEncontrado;
};

export default estudiantesService;
