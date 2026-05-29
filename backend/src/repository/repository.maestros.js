import { leerJSON, guardarJSON } from './repository.base.js';

const ARCHIVO = 'maestro.json';

export const obtenerTodos = () => {
    return leerJSON(ARCHIVO);
};

export const obtenerPorId = (idUsuario) => {
    const maestros = obtenerTodos();
    return maestros.find(m => m.idUsuario === idUsuario);
};

export const obtenerPorEmail = (email) => {
    const maestros = obtenerTodos();
    return maestros.find(m => m.email === email);
};

export const guardarTodos = (maestros) => {
    return guardarJSON(ARCHIVO, maestros);
};

export const agregarMaestro = (nuevoMaestro) => {
    const maestros = obtenerTodos();
    maestros.push(nuevoMaestro);
    return guardarTodos(maestros);
};
