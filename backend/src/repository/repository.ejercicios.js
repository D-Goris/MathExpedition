import { leerJSON, guardarJSON } from './repository.base.js';

const ARCHIVO = 'ejercicios.json';

export const obtenerTodos = () => {
    return leerJSON(ARCHIVO);
};

export const obtenerPorId = (idEjercicio) => {
    const ejercicios = obtenerTodos();
    return ejercicios.find(e => e.id === idEjercicio || e.idEjercicio === idEjercicio);
};

export const guardarTodos = (ejercicios) => {
    return guardarJSON(ARCHIVO, ejercicios);
};

export const agregarEjercicio = (nuevoEjercicio) => {
    const ejercicios = obtenerTodos();
    ejercicios.push(nuevoEjercicio);
    return guardarTodos(ejercicios);
};

export const obtenerPorMision = (misionId) => {
    const ejercicios = obtenerTodos();
    return ejercicios.filter(e => e.temaId === misionId || e.temaId === String(misionId) || e.temaId === parseInt(misionId));
};
