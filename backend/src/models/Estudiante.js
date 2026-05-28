import Usuario from './Usuario.js';

class Estudiante extends Usuario {
    constructor(idUsuario, name, grado = 3, edad = 9, nivel = 1) {
        super(idUsuario, ''); // La contraseña se asignará a través de la propiedad de forma dinámica
        this.name = name; // Nombre de perfil / usuario
        this.grado = grado;
        this.edad = edad;
        this.nivel = nivel;
        this.nombreCompleto = '';
        this.ejerciciosResueltos = [];
        this.registrosAvance = [];
    }

    // Método de guardado del progreso real
    realizarEjercicio(idEjercicio) {
        if (!this.ejerciciosResueltos.includes(idEjercicio)) {
            this.ejerciciosResueltos.push(idEjercicio);
        }
        return { msg: `Ejercicio ${idEjercicio} registrado en el avance.` };
    }
}

export default Estudiante;
