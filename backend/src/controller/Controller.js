const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Importar las clases necesarias para instanciarlas
const Ejercicio = require('../models/Ejercicio');
const Estudiante = require('../models/Estudiante');
const Maestro = require('../models/Maestro');
const RegistroAvance = require('../models/RegistroAvance');
const Grupo = require('../models/Grupo');
const Mision = require('../models/Mision');
const Usuario = require('../models/Usuario');

class Controller {
    constructor() {
        this.ejercicios = [];
        this.estudiantes = [];
        this.maestros = [];
        this.grupos = [];
        this.misiones = [];
        this.dataPath = path.join(__dirname, '../data');
    }

    /**
     * Inicia el controlador, lee los JSON y los convierte en listas de objetos
     */
    iniciar() {
        console.log('Iniciando controlador y cargando datos...');
        this.cargarEjercicios();
        this.cargarEstudiantes();
        this.cargarMaestros();
        this.cargarGrupos();
        this.cargarMisiones();
        console.log('Datos cargados exitosamente.');
    }

    /**
     * Método genérico para leer archivos JSON
     */
    leerJSON(archivo) {
        const ruta = path.join(this.dataPath, archivo);
        if (!fs.existsSync(ruta)) {
            console.warn(`El archivo ${archivo} no existe. Se creará uno vacío.`);
            fs.writeFileSync(ruta, '[]', 'utf-8');
            return [];
        }

        const contenido = fs.readFileSync(ruta, 'utf-8');
        if (!contenido.trim()) return [];

        try {
            return JSON.parse(contenido);
        } catch (error) {
            console.error(`Error al parsear el archivo ${archivo}:`, error);
            return [];
        }
    }

    /**
     * Método genérico para guardar listas en archivos JSON
     */
    guardarJSON(archivo, datos) {
        const ruta = path.join(this.dataPath, archivo);
        try {
            fs.writeFileSync(ruta, JSON.stringify(datos, null, 4), 'utf-8');
            return true;
        } catch (error) {
            console.error(`Error al guardar el archivo ${archivo}:`, error);
            return false;
        }
    }

    /**
     * Valida que el objeto proveniente del JSON tenga todos los atributos requeridos de la clase
     */
    validarAtributos(objeto, atributosEsperados) {
        return atributosEsperados.every(attr => objeto.hasOwnProperty(attr));
    }

    cargarEjercicios() {
        this.ejercicios = [];
        const datos = this.leerJSON('ejercicios.json');

        datos.forEach(item => {
            const id = item.idEjercicio !== undefined ? item.idEjercicio : item.id;
            const enunciado = item.enunciado;
            if (id !== undefined && enunciado) {
                const nivelDificultad = item.nivelDificultad !== undefined ? item.nivelDificultad : 1;
                const opcionA = item.opcionA || (item.opciones && item.opciones.A) || '';
                const opcionB = item.opcionB || (item.opciones && item.opciones.B) || '';
                const opcionC = item.opcionC || (item.opciones && item.opciones.C) || '';
                const opcionD = item.opcionD || (item.opciones && item.opciones.D) || '';
                const respuestaCorrecta = item.respuestaCorrecta || '';
                const misionId = item.misionId || item.temaId || '';

                const ejercicio = new Ejercicio(
                    id, nivelDificultad, enunciado,
                    opcionA, opcionB, opcionC, opcionD,
                    respuestaCorrecta, misionId
                );
                this.ejercicios.push(ejercicio);
            } else {
                console.warn(`Atributos faltantes en ejercicio: ${JSON.stringify(item)}`);
            }
        });
    }

    cargarEstudiantes() {
        this.estudiantes = [];
        const datos = this.leerJSON('estudiantes.json');

        datos.forEach(item => {
            // Normalizar idUsuario desde idUsuario o _idUsuario
            const idUsuario = item.idUsuario !== undefined ? item.idUsuario : item._idUsuario;
            if (idUsuario !== undefined) {
                const profileName = item.apodo || item.name || '';
                const realName = item.name || '';
                const grado = item.grado !== undefined ? item.grado : 3;
                const edad = item.edad !== undefined ? item.edad : 9;
                const nivel = item.nivel !== undefined ? item.nivel : 1;

                // Instanciar el Estudiante
                const estudiante = new Estudiante(idUsuario, profileName, grado, edad, nivel);
                estudiante.nombreCompleto = item.nombreCompleto || realName;
                estudiante.password = item.password || '';

                if (item.ejerciciosResueltos && Array.isArray(item.ejerciciosResueltos)) {
                    estudiante.ejerciciosResueltos = [...item.ejerciciosResueltos];
                }

                // Si el JSON tiene registros de avance, instanciarlos y agregarlos al estudiante
                if (item.registrosAvance && Array.isArray(item.registrosAvance)) {
                    item.registrosAvance.forEach(registro => {
                        const attrReg = ['idRegistro', 'fecha', 'intentos', 'aciertos', 'puntaje', 'tiempo'];
                        if (this.validarAtributos(registro, attrReg)) {
                            const nuevoRegistro = new RegistroAvance(
                                registro.idRegistro, registro.fecha, registro.intentos,
                                registro.aciertos, registro.puntaje, registro.tiempo
                            );
                            estudiante.registrosAvance.push(nuevoRegistro);
                        }
                    });
                }

                this.estudiantes.push(estudiante);
            } else {
                console.warn(`Atributos faltantes en estudiante: ${JSON.stringify(item)}`);
            }
        });
    }

    cargarMaestros() {
        this.maestros = [];
        const datos = this.leerJSON('maestro.json');

        datos.forEach(item => {
            // Normalizar idUsuario desde idUsuario o _idUsuario
            const idUsuario = item.idUsuario !== undefined ? item.idUsuario : item._idUsuario;
            const tieneId = idUsuario !== undefined;
            const otrosAtributosValidos = ['name', 'email', 'password'].every(attr => item.hasOwnProperty(attr));

            if (tieneId && otrosAtributosValidos) {
                const maestro = new Maestro(idUsuario, item.name, item.email, item.password);
                this.maestros.push(maestro);
            } else {
                console.warn(`Atributos faltantes en maestro: ${JSON.stringify(item)}`);
            }
        });
    }



    cargarGrupos() {
        this.grupos = [];
        const datos = this.leerJSON('grupos.json');
        const atributosRequeridos = ['idGrupo', 'nombre', 'descripcion'];

        datos.forEach(item => {
            if (this.validarAtributos(item, atributosRequeridos)) {
                const grupo = new Grupo(item.idGrupo, item.nombre, item.descripcion, item.estudiantesIds || [], item.misionesIds || []);
                this.grupos.push(grupo);
            } else {
                console.warn(`Atributos faltantes en grupo: ${JSON.stringify(item)}`);
            }
        });
    }

    cargarMisiones() {
        this.misiones = [];
        const datos = this.leerJSON('misiones.json');

        datos.forEach(item => {
            if (item.idMision !== undefined && item.nombre !== undefined) {
                const descripcion = item.descripcion || '';
                const mision = new Mision(item.idMision, item.nombre, descripcion, item.ejerciciosIds || []);
                this.misiones.push(mision);
            } else {
                console.warn(`Atributos faltantes en mision: ${JSON.stringify(item)}`);
            }
        });
    }

    // --- Métodos de Guardado de Listas a Ficheros JSON ---

    guardarEjercicios() {
        return this.guardarJSON('ejercicios.json', this.ejercicios);
    }

    guardarEstudiantes() {
        return this.guardarJSON('estudiantes.json', this.estudiantes);
    }

    guardarMaestros() {
        return this.guardarJSON('maestro.json', this.maestros);
    }



    guardarGrupos() {
        return this.guardarJSON('grupos.json', this.grupos);
    }

    guardarMisiones() {
        return this.guardarJSON('misiones.json', this.misiones);
    }

    // --- Métodos de acceso para el Frontend ---

    obtenerEjercicios() {
        return this.ejercicios;
    }

    obtenerEstudiantes() {
        return this.estudiantes;
    }

    obtenerMaestros() {
        return this.maestros;
    }



    obtenerGrupos() {
        return this.grupos;
    }

    obtenerMisiones() {
        return this.misiones;
    }

    // --- Funcionalidades de Autenticación y Registro ---

    loginMaestro(email, password) {
        const maestro = this.maestros.find(m => m.email.toLowerCase() === email.toLowerCase());
        if (!maestro) return null;

        // Valida con la clase Usuario (soporta hash bcrypt y texto plano de fallback para semillas)
        const passwordCorrecto = Usuario.verificarPassword(password, maestro.password) || maestro.password === password;
        if (passwordCorrecto) {
            return maestro;
        }
        return null;
    }

    registrarMaestro(name, email, password) {
        const existe = this.maestros.some(m => m.email.toLowerCase() === email.toLowerCase());
        if (existe) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const nuevoId = this.maestros.length > 0 ? Math.max(...this.maestros.map(m => m.idUsuario)) + 1 : 1;
        const hashedPassword = Usuario.encriptarPassword(password);

        const nuevoMaestro = new Maestro(nuevoId, name, email, hashedPassword);
        this.maestros.push(nuevoMaestro);
        this.guardarMaestros();
        return nuevoMaestro;
    }

    loginEstudiante(nombrePerfil, password) {
        const estudiante = this.estudiantes.find(e => e.name.toLowerCase() === nombrePerfil.toLowerCase());
        if (!estudiante) return null;

        // Se valida contraseña si el estudiante la tiene configurada
        if (estudiante.password) {
            const passwordCorrecto = Usuario.verificarPassword(password, estudiante.password) || estudiante.password === password;
            if (!passwordCorrecto) {
                return null;
            }
        }
        return estudiante;
    }

    registrarEstudiante(nombreReal, perfil, password) {
        const existe = this.estudiantes.some(e => e.name.toLowerCase() === perfil.toLowerCase());
        if (existe) {
            throw new Error('El nombre de perfil ya está en uso por otro explorador.');
        }

        const nuevoId = this.estudiantes.length > 0 ? Math.max(...this.estudiantes.map(e => e.idUsuario)) + 1 : 1;
        const hashedPassword = Usuario.encriptarPassword(password);

        const nuevoEstudiante = new Estudiante(nuevoId, perfil, 3, 9, 1);
        nuevoEstudiante.nombreCompleto = nombreReal;
        nuevoEstudiante.password = hashedPassword;

        this.estudiantes.push(nuevoEstudiante);
        this.guardarEstudiantes();
        return nuevoEstudiante;
    }

    // --- Gestión de Grupos y Asignaciones ---

    registrarGrupo(nombre, descripcion) {
        const existe = this.grupos.some(g => g.nombre.toLowerCase() === nombre.toLowerCase());
        if (existe) {
            throw new Error(`El grupo "${nombre}" ya existe.`);
        }

        const idGrupo = 'grupo_' + Date.now();
        const nuevoGrupo = new Grupo(idGrupo, nombre, descripcion, [], []);
        this.grupos.push(nuevoGrupo);
        this.guardarGrupos();
        return nuevoGrupo;
    }

    agregarEstudianteAGrupo(idGrupo, idEstudiante) {
        idEstudiante = parseInt(idEstudiante);
        // Quitar al estudiante de cualquier otro grupo primero
        this.grupos.forEach(grupo => {
            const index = grupo.estudiantesIds.indexOf(idEstudiante);
            if (index !== -1) {
                grupo.estudiantesIds.splice(index, 1);
            }
        });

        const grupoDestino = this.grupos.find(g => g.idGrupo === idGrupo);
        if (grupoDestino) {
            if (!grupoDestino.estudiantesIds.includes(idEstudiante)) {
                grupoDestino.estudiantesIds.push(idEstudiante);
            }
            this.guardarGrupos();
            return true;
        }
        return false;
    }

    quitarEstudianteDeGrupo(idGrupo, idEstudiante) {
        idEstudiante = parseInt(idEstudiante);
        const grupo = this.grupos.find(g => g.idGrupo === idGrupo);
        if (grupo) {
            const index = grupo.estudiantesIds.indexOf(idEstudiante);
            if (index !== -1) {
                grupo.estudiantesIds.splice(index, 1);
                this.guardarGrupos();
                return true;
            }
        }
        return false;
    }

    asignarMisionAGrupo(idMision, idGrupo) {
        const grupo = this.grupos.find(g => g.idGrupo === idGrupo);
        if (grupo) {
            if (!grupo.misionesIds.includes(idMision)) {
                grupo.misionesIds.push(idMision);
                this.guardarGrupos();
                return true;
            }
        }
        return false;
    }

    // --- Gestión de Ejercicios ---

    registrarEjercicio(nivelDificultad, enunciado, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, misionId) {
        const nuevoId = this.ejercicios.length > 0 ? Math.max(...this.ejercicios.map(e => e.id || e.idEjercicio || 0)) + 1 : 1;

        const nuevoEjercicio = new Ejercicio(
            nuevoId, parseInt(nivelDificultad), enunciado,
            opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, misionId
        );

        this.ejercicios.push(nuevoEjercicio);
        this.guardarEjercicios();

        const mision = this.misiones.find(m => m.idMision == misionId);
        if (mision) {
            mision.agregarEjercicio(nuevoEjercicio);
            this.guardarMisiones();
        }

        return nuevoEjercicio;
    }

    
}



// Inicializar el controlador y exportarlo
const controllerInstancia = new Controller();
controllerInstancia.iniciar();

module.exports = controllerInstancia;
