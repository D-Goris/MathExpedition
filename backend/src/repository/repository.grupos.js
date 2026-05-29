import { leerJSON, guardarJSON } from './repository.base.js';

const ARCHIVO = 'grupos.json';

export const obtenerTodos = () => {
    return leerJSON(ARCHIVO);
};

export const obtenerPorId = (idGrupo) => {
    const grupos = obtenerTodos();
    return grupos.find(g => g.idGrupo === idGrupo);
};

export const guardarTodos = (grupos) => {
    return guardarJSON(ARCHIVO, grupos);
};

export const agregarGrupo = (nuevoGrupo) => {
    const grupos = obtenerTodos();
    grupos.push(nuevoGrupo);
    return guardarTodos(grupos);
};

export const actualizarGrupo = (idGrupo, datosActualizados) => {
    const grupos = obtenerTodos();
    const index = grupos.findIndex(g => g.idGrupo === idGrupo);
    if (index !== -1) {
        grupos[index] = { ...grupos[index], ...datosActualizados };
        return guardarTodos(grupos);
    }
    return false;
};
