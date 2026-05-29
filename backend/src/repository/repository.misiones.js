import { leerJSON, guardarJSON } from './repository.base.js';

const ARCHIVO = 'misiones.json';

export const obtenerTodos = () => {
    return leerJSON(ARCHIVO);
};

export const obtenerPorId = (idMision) => {
    const misiones = obtenerTodos();
    return misiones.find(m => m.idMision === idMision || m.idMision === parseInt(idMision));
};

export const guardarTodos = (misiones) => {
    return guardarJSON(ARCHIVO, misiones);
};

export const agregarMision = (nuevaMision) => {
    const misiones = obtenerTodos();
    misiones.push(nuevaMision);
    return guardarTodos(misiones);
};

export const actualizarMision = (idMision, datosActualizados) => {
    const misiones = obtenerTodos();
    const index = misiones.findIndex(m => m.idMision === idMision || m.idMision === parseInt(idMision));
    if (index !== -1) {
        misiones[index] = { ...misiones[index], ...datosActualizados };
        return guardarTodos(misiones);
    }
    return false;
};
