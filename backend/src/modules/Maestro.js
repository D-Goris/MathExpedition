// src/models/Maestro.js
import { Usuario } from './Usuario.js';

export class Maestro extends Usuario {
    constructor(idUsuario, password, name, email) {
        super(idUsuario, password); 
        this.name = name;
        this.email = email;
    }

    // Métodos administrativos nativos que propuso tu compañero para el futuro
    verAvanceIndividual(estudiante) {
        console.log(`Mostrando avance individual de: ${estudiante.name}`);
        return {}; // Stub para desarrollo posterior
    }

    verAvanceColectivo() {
        console.log("Mostrando avance colectivo del grupo.");
        return {}; // Stub para desarrollo posterior
    }

    filtrarInformacion(criterio) {
        console.log(`Filtrando estudiantes por criterio: ${criterio}`);
        return [];
    }
}