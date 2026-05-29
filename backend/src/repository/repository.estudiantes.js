import { leerJSON, guardarJSON } from './repository.base.js';

const ARCHIVO = 'estudiantes.json';

export const obtenerTodos = () => {
    return leerJSON(ARCHIVO);
};

export const obtenerPorId = (idUsuario) => {
    const estudiantes = obtenerTodos();
    return estudiantes.find(e => (e._idUsuario || e.idUsuario) === idUsuario);
};

export const obtenerPorNombrePerfil = (name) => {
    const estudiantes = obtenerTodos();
    return estudiantes.find(e => e.name === name);
};

export const guardarTodos = (estudiantes) => {
    return guardarJSON(ARCHIVO, estudiantes);
};

export const agregarEstudiante = (nuevoEstudiante) => {
    const estudiantes = obtenerTodos();
    estudiantes.push(nuevoEstudiante);
    return guardarTodos(estudiantes);
};

export const actualizarEstudiante = (idUsuario, datosActualizados) => {
    const estudiantes = obtenerTodos();
    const index = estudiantes.findIndex(e => (e._idUsuario || e.idUsuario) === idUsuario);
    if (index !== -1) {
        estudiantes[index] = { ...estudiantes[index], ...datosActualizados };
        return guardarTodos(estudiantes);
    }
    return false;
};
