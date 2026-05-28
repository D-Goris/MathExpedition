// src/modules/misiones/misiones.service.js
import fs from 'fs';
import path from 'path';

const misionesService = {};

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rutaMisiones = path.join(__dirname, '../../data/misiones.json');
const rutaEjercicios = path.join(__dirname, '../../data/ejercicios.json');

misionesService.obtenerMisiones = () => {
    return JSON.parse(fs.readFileSync(rutaMisiones, 'utf-8'));
};

misionesService.obtenerEjerciciosPorMision = (idMision) => {
    const misiones = JSON.parse(fs.readFileSync(rutaMisiones, 'utf-8'));
    
    const misionEncontrada = misiones.find(m => m.idMision === Number(idMision));
    if (!misionEncontrada) return null;

    const todosLosEjercicios = JSON.parse(fs.readFileSync(rutaEjercicios, 'utf-8'));

    const ejerciciosDeLaMision = todosLosEjercicios.filter(ejercicio => 
        misionEncontrada.ejerciciosIds.includes(ejercicio.id)
    );

    return ejerciciosDeLaMision;
};

misionesService.crearEjercicioEInyectar = (idMision, datosEjercicio) => {
    // 1. Validar que la misión exista
    const misiones = JSON.parse(fs.readFileSync(rutaMisiones, 'utf-8'));
    const misionEncontrada = misiones.find(m => m.idMision === Number(idMision));
    
    if (!misionEncontrada) {
        return { error: 'La misión destino no existe' };
    }

    // 2. Leer los ejercicios actuales
    const ejercicios = JSON.parse(fs.readFileSync(rutaEjercicios, 'utf-8'));

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
    ejercicios.push(nuevoEjercicio);
    fs.writeFileSync(rutaEjercicios, JSON.stringify(ejercicios, null, 2), 'utf-8');

    // 6. Inyectar el nuevo ID en el array 'ejerciciosIds' de la misión
    misionEncontrada.ejerciciosIds.push(nuevoId);
    fs.writeFileSync(rutaMisiones, JSON.stringify(misiones, null, 2), 'utf-8');

    return nuevoEjercicio; // Devolvemos el ejercicio creado
};

export default misionesService;