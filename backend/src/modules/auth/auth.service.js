import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Usuario from '../../models/Usuario.js';

const authService = {};

// ¡RUTAS ABSOLUTAS SEGURAS!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rutaEstudiantes = path.join(__dirname, '../../data/estudiantes.json');
const rutaMaestros = path.join(__dirname, '../../data/maestro.json');

authService.autenticarUsuario = (identificador, password, rol) => {
    const estudiantes = JSON.parse(fs.readFileSync(rutaEstudiantes, 'utf-8'));
    const maestros = JSON.parse(fs.readFileSync(rutaMaestros, 'utf-8'));

    // --- LOGIC PARA ESTUDIANTES ---
    if (rol === 'estudiante' || !rol) { 
        // Busca en estudiantes.json por idUsuario, _idUsuario o su nombre de perfil (name)
        const estudianteEncontrado = estudiantes.find(e => 
            e.idUsuario === identificador || 
            e._idUsuario === identificador || 
            e.name === identificador
        );

        if (estudianteEncontrado) {
            if (Usuario.verificarPassword(password, estudianteEncontrado.password)) {
                return {
                    idUsuario: estudianteEncontrado._idUsuario || estudianteEncontrado.idUsuario,
                    name: estudianteEncontrado.name,
                    rol: 'estudiante'
                };
            }
            return { error: 'Contraseña incorrecta' };
        }
    }

    // --- LOGIC PARA PROFESORES ---
    // Si el rol es maestro (o si falla el estudiante y coincide con un maestro)
    const maestroEncontrado = maestros.find(m => 
        m.idUsuario === identificador || 
        m.email === identificador
    );

    if (maestroEncontrado) {
        // CORRECCIÓN BCRYPT: Desencriptamos el hash "$2b$10$w1msP7WI..." usando tu clase Usuario
        if (Usuario.verificarPassword(password, maestroEncontrado.password)) {
            return {
                idUsuario: maestroEncontrado.idUsuario,
                name: maestroEncontrado.name,
                rol: 'maestro'
            };
        }
        return { error: 'Contraseña incorrecta' };
    }

    // Si no se encontró en ningún archivo
    return null;
};

authService.registrarEstudiante = (datosEstudiante) => {
    const { nombreCompleto, nombrePerfil, password } = datosEstudiante;
    const estudiantes = JSON.parse(fs.readFileSync(rutaEstudiantes, 'utf-8'));
    
    // 1. Evitar duplicados: Validar si el nombre de perfil ya está en uso
    // En tu estudiantes.json, el nombre de perfil está bajo la clave "name"
    if (estudiantes.find(e => e.name === nombrePerfil)) {
        return { error: 'Ese nombre de explorador ya está en uso. ¡Elige otro!' };
    }

    // 2. Generar id de forma secuencial y automática (Ej: est-004)
    const nuevoId = `est-${String(estudiantes.length + 1).padStart(3, '0')}`;

    // 3. Encriptar la contraseña de forma segura
    const passwordEncriptada = Usuario.encriptarPassword(password);

    // 4. Construir el objeto estudiante con TODO el esquema base necesario para el juego
    const nuevoEstudiante = {
        _idUsuario: nuevoId,
        password: passwordEncriptada,
        name: nombrePerfil,
        grado: 3,         // Valores por defecto para empezar a jugar
        edad: 9,
        nivel: 1,
        nombreCompleto: nombreCompleto,
        ejerciciosResueltos: [],
        registrosAvance: []
    };

    // 5. Guardar en la base de datos JSON
    estudiantes.push(nuevoEstudiante);
    fs.writeFileSync(rutaEstudiantes, JSON.stringify(estudiantes, null, 2), 'utf-8');
    
    // Retornamos datos seguros sin la contraseña
    return { idUsuario: nuevoId, name: nombrePerfil };
};

authService.registrarMaestro = (datosMaestro) => {
    const { name, email, password } = datosMaestro;
    const maestros = JSON.parse(fs.readFileSync(rutaMaestros, 'utf-8'));
    
    // 1. Evitar que se registren dos profesores con el mismo correo electrónico
    if (maestros.find(m => m.email === email)) {
        return { error: 'El correo electrónico ya está registrado en el sistema.' };
    }

    // 2. Generar el idUsuario de forma secuencial y automática (Ej: prof-002)
    // Tomamos el largo actual del arreglo y le sumamos 1, rellenando con ceros a la izquierda
    const nuevoId = `prof-${String(maestros.length + 1).padStart(3, '0')}`;

    // 3. Encriptar la contraseña usando el método estático nativo de tu clase Usuario.js
    const passwordEncriptada = Usuario.encriptarPassword(password);

    // 4. Construir el objeto maestro con la estructura exacta de tu archivo maestro.json
    const nuevoMaestro = {
        idUsuario: nuevoId,
        password: passwordEncriptada,
        name: name,
        email: email
    };

    // 5. Inyectar y reescribir de forma limpia el archivo JSON
    maestros.push(nuevoMaestro);
    fs.writeFileSync(rutaMaestros, JSON.stringify(maestros, null, 2), 'utf-8');
    
    // Devolvemos los datos del perfil creado (sin exponer la contraseña encriptada)
    return { idUsuario: nuevoId, name, email };
};

export default authService;