import { Usuario } from './Usuario.js';

export class Estudiante extends Usuario {
    constructor(idUsuario, password, name, apodo) {
        super(idUsuario, password); 
        this.name = name;
        this.apodo = apodo;
        this.ejerciciosResueltos = [];
    }

    //método de uardando el progreso real
    realizarEjercicio(idEjercicio) {
        if (!this.ejerciciosResueltos.includes(idEjercicio)) {
            this.ejerciciosResueltos.push(idEjercicio);
        }
        return { msg: `Ejercicio ${idEjercicio} registrado en el avance.` };
    }
}