import * as repoGrupos from '../../repository/repository.grupos.js';

const gruposService = {};

gruposService.obtenerGrupos = () => {
    return repoGrupos.obtenerTodos();
};

gruposService.crearGrupo = (nombre, descripcion) => {
    const grupos = repoGrupos.obtenerTodos();

    if (grupos.find(g => g.nombre.toLowerCase() === nombre.toLowerCase())) {
        return { error: 'El grupo ya existe' };
    }

    const nuevoId = 'grupo-' + Date.now(); // ID único

    const nuevoGrupo = {
        idGrupo: nuevoId,
        nombre,
        descripcion,
        estudiantesIds: [],
        misionesIds: []
    };

    repoGrupos.agregarGrupo(nuevoGrupo);

    return nuevoGrupo;
};

gruposService.asignarAlumno = (idGrupo, idAlumno) => {
    const grupos = repoGrupos.obtenerTodos();
    const grupo = grupos.find(g => g.idGrupo === idGrupo);

    if (!grupo) return { error: 'Grupo no encontrado' };

    // Remove student from any other group first
    grupos.forEach(g => {
        g.estudiantesIds = g.estudiantesIds.filter(id => id !== idAlumno);
    });

    // Add to the new group
    grupo.estudiantesIds.push(idAlumno);
    
    repoGrupos.guardarTodos(grupos);
    return grupo;
};

gruposService.removerAlumno = (idGrupo, idAlumno) => {
    const grupos = repoGrupos.obtenerTodos();
    const grupo = grupos.find(g => g.idGrupo === idGrupo);

    if (!grupo) return { error: 'Grupo no encontrado' };

    grupo.estudiantesIds = grupo.estudiantesIds.filter(id => id !== idAlumno);

    repoGrupos.guardarTodos(grupos);
    return grupo;
};

gruposService.asignarMision = (idGrupo, idMision) => {
    const grupos = repoGrupos.obtenerTodos();
    const grupo = grupos.find(g => g.idGrupo === idGrupo);

    if (!grupo) return { error: 'Grupo no encontrado' };

    if (!grupo.misionesIds.includes(Number(idMision))) {
        grupo.misionesIds.push(Number(idMision));
    }

    repoGrupos.guardarTodos(grupos);
    return grupo;
};

export default gruposService;
