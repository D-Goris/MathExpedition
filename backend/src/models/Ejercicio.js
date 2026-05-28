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
}