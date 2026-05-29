import Usuario from './Usuario.js';

class Estudiante extends Usuario {
    constructor(idUsuario, name) {
        super(idUsuario, ''); // La contraseña se asignará a través de la propiedad de forma dinámica
        this.name = name; // Nombre de perfil / usuario
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
