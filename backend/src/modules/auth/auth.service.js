import * as repoEstudiantes from '../../repository/repository.estudiantes.js';
import * as repoMaestros from '../../repository/repository.maestros.js';
import Usuario from '../../models/Usuario.js';

const authService = {};

authService.autenticarUsuario = (identificador, password, rol) => {
    // --- LOGIC PARA ESTUDIANTES ---
    if (rol === 'estudiante' || !rol) { 
        // Busca en estudiantes por idUsuario o su nombre de perfil (name)
        const estudianteEncontrado = repoEstudiantes.obtenerTodos().find(e => 
            (e.idUsuario || e._idUsuario) === identificador || 
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
    const maestroEncontrado = repoMaestros.obtenerTodos().find(m => 
        m.idUsuario === identificador || 
        m.email === identificador
    );

    if (maestroEncontrado) {
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
    
    // 1. Evitar duplicados: Validar si el nombre de perfil ya está en uso
    if (repoEstudiantes.obtenerPorNombrePerfil(nombrePerfil)) {
        return { error: 'Ese nombre de explorador ya está en uso. ¡Elige otro!' };
    }

    // 2. Generar id de forma secuencial y automática (Ej: est-004)
    const estudiantes = repoEstudiantes.obtenerTodos();
    const nuevoId = `est-${String(estudiantes.length + 1).padStart(3, '0')}`;

    // 3. Encriptar la contraseña de forma segura
    const passwordEncriptada = Usuario.encriptarPassword(password);

    // 4. Construir el objeto estudiante con TODO el esquema base necesario para el juego
    const nuevoEstudiante = {
        _idUsuario: nuevoId,
        password: passwordEncriptada,
        name: nombrePerfil,
        nombreCompleto: nombreCompleto,
        ejerciciosResueltos: [],
        registrosAvance: []
    };

    // 5. Guardar en el repositorio
    repoEstudiantes.agregarEstudiante(nuevoEstudiante);
    
    // Retornamos datos seguros sin la contraseña
    return { idUsuario: nuevoId, name: nombrePerfil };
};

authService.registrarMaestro = (datosMaestro) => {
    const { name, email, password } = datosMaestro;
    
    // 1. Evitar que se registren dos profesores con el mismo correo electrónico
    if (repoMaestros.obtenerPorEmail(email)) {
        return { error: 'El correo electrónico ya está registrado en el sistema.' };
    }

    // 2. Generar el idUsuario de forma secuencial y automática (Ej: prof-002)
    const maestros = repoMaestros.obtenerTodos();
    const nuevoId = `prof-${String(maestros.length + 1).padStart(3, '0')}`;

    // 3. Encriptar la contraseña
    const passwordEncriptada = Usuario.encriptarPassword(password);

    // 4. Construir el objeto maestro
    const nuevoMaestro = {
        idUsuario: nuevoId,
        password: passwordEncriptada,
        name: name,
        email: email
    };

    // 5. Guardar en el repositorio
    repoMaestros.agregarMaestro(nuevoMaestro);
    
    // Devolvemos los datos del perfil creado (sin exponer la contraseña encriptada)
    return { idUsuario: nuevoId, name, email };
};

export default authService;