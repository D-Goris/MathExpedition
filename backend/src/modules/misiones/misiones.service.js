import * as repoMisiones from '../../repository/repository.misiones.js';
import * as repoEjercicios from '../../repository/repository.ejercicios.js';

const misionesService = {};

misionesService.obtenerMisiones = () => {
    return repoMisiones.obtenerTodos();
};

misionesService.obtenerEjerciciosPorMision = (idMision) => {
    const misionEncontrada = repoMisiones.obtenerPorId(idMision);
    if (!misionEncontrada) return null;

    const todosLosEjercicios = repoEjercicios.obtenerTodos();

    const ejerciciosDeLaMision = todosLosEjercicios.filter(ejercicio => 
        misionEncontrada.ejerciciosIds.includes(ejercicio.id)
    );

    return ejerciciosDeLaMision;
};

misionesService.crearMision = (nombreMision) => {
    const misiones = repoMisiones.obtenerTodos();
    
    if (misiones.find(m => m.nombre.toLowerCase() === nombreMision.toLowerCase())) {
        return { error: 'Ya existe una misión con ese nombre' };
    }

    const nuevoId = misiones.length > 0 ? Math.max(...misiones.map(m => m.idMision)) + 1 : 1;

    const nuevaMision = {
        idMision: nuevoId,
        nombre: nombreMision,
        ejerciciosIds: []
    };

    repoMisiones.agregarMision(nuevaMision);

    return nuevaMision;
};

misionesService.crearEjercicioEInyectar = (idMision, datosEjercicio) => {
    // 1. Validar que la misión exista
    const misionEncontrada = repoMisiones.obtenerPorId(idMision);
    
    if (!misionEncontrada) {
        return { error: 'La misión destino no existe' };
    }

    // 2. Leer los ejercicios actuales
    const ejercicios = repoEjercicios.obtenerTodos();

    // 3. Generar un nuevo ID dinámico (buscamos el ID más alto y le sumamos 1)
    const nuevoId = ejercicios.length > 0 ? Math.max(...ejercicios.map(e => e.id)) + 1 : 1;

    // 4. Estructurar el nuevo ejercicio tal como lo dicta tu ejercicios.json
    const nuevoEjercicio = {
        id: nuevoId,
        enunciado: datosEjercicio.pregunta, // Viene del req.body del frontend
        opciones: {
            A: datosEjercicio.opA,
            B: datosEjercicio.opB,
            C: datosEjercicio.opC,
            D: datosEjercicio.opD
        },
        respuestaCorrecta: datosEjercicio.correcta,
        temaId: idMision // Vinculamos el ID de la misión/tema
    };

    // 5. Guardar el nuevo ejercicio en ejercicios.json
    repoEjercicios.agregarEjercicio(nuevoEjercicio);

    // 6. Inyectar el nuevo ID en el array 'ejerciciosIds' de la misión
    misionEncontrada.ejerciciosIds.push(nuevoId);
    repoMisiones.actualizarMision(idMision, { ejerciciosIds: misionEncontrada.ejerciciosIds });

    return nuevoEjercicio; // Devolvemos el ejercicio creado
};

export default misionesService;