let ejerciciosList = [];

class Ejercicio {
    constructor(id, nivelDificultad, enunciado, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, misionId) {
        this.id = id;                               
        this.nivelDificultad = nivelDificultad;
        this.enunciado = enunciado;
        this.opcionA = opcionA;
        this.opcionB = opcionB;
        this.opcionC = opcionC;
        this.opcionD = opcionD;
        
        // Mantener también el objeto agrupado para compatibilidad con el frontend
        this.opciones = {                             
            A: opcionA,
            B: opcionB,
            C: opcionC,
            D: opcionD
        };
        this.respuestaCorrecta = respuestaCorrecta;
        this.misionId = misionId;
    }

    /**
     * Retorna una versión idéntica del ejercicio pero sin la respuesta correcta,
     * evitando que los alumnos hagan trampa inspeccionando el navegador.
     */
    obtenerVersionSegura() {
        return {
            id: this.id,
            nivelDificultad: this.nivelDificultad,
            enunciado: this.enunciado,
            opciones: this.opciones,
            misionId: this.misionId
        };
    }
    
    /**
     * Busca un ejercicio específico por su id en la lista estática.
     */
    obtenerJuegoPorID(id) {
        for (let ej of ejerciciosList) {
            if (ej.id === id) {
                return ej;
            }
        }
        return null;
    }

    /**
     * Comprueba si una opción seleccionada es correcta.
     */
    comprobarRespuesta(opcionSeleccionada) {
        if (opcionSeleccionada === this.respuestaCorrecta) {
            return true;
        } else {
            console.log('Respuesta incorrecta');
            return false;
        }
    }
}

export default Ejercicio;
export { ejerciciosList };
