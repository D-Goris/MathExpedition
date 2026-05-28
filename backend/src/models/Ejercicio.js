let ejerciciosList = [];

const mision = require("./Mision")
export class Ejercicio {

    

    constructor(id, enunciado, opciones, respuestaCorrecta, temaId) {
        this.id = id;                               
        this.enunciado = enunciado;
        this.opciones = {                             
            A: opciones.A,
            B: opciones.B,
            C: opciones.C,
            D: opciones.D
        };
        this.respuestaCorrecta = respuestaCorrecta;
        this.temaId = temaId;
    }

    /**
     * Retorna una versión idéntica del ejercicio pero sin la respuesta correcta,
     * evitando que los alumnos hagan trampa inspeccionando el navegador.
     */
    obtenerVersionSegura() {
        return {
            id: this.id,
            enunciado: this.enunciado,
            opciones: this.opciones,
            temaId: this.temaId
        };
    }
    
    /*metodo para buscar un ejercicio especifico por su id*/

    obtenerJuegoPorID(id){
        const ejercicio = ejercicios.find(ej => ej.id === id);
        for (let ejercicio of ejerciciosList) {
            if (ejercicio.id === id) {
                return ejercicio;
            }
    }
    return null; // Si no se encuentra el ejercicio, retorna null
}

//metodo para comprobar si una respuesta esta correcta

    comprobarRespuesta(opcionSeleccionada) {
        //const esCorrecta = opcionSeleccionada === this.respuestaCorrecta;
        if (opcionSeleccionada === this.respuestaCorrecta) {
            return true;
        } else {
            console.log('respuesta incorrecta');
            return false;
        }
    
}





}