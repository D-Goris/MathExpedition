import * as repoMaestros from '../../repository/repository.maestros.js';

const maestrosService = {};

maestrosService.obtenerPerfil = (idUsuario) => {
    const maestroEncontrado = repoMaestros.obtenerPorId(idUsuario);

    if (!maestroEncontrado) {
        return { error: 'Perfil de profesor no encontrado' };
    }

    // Devolver los datos sin la contraseña
    return {
        idUsuario: maestroEncontrado.idUsuario,
        name: maestroEncontrado.name,
        email: maestroEncontrado.email
    };
};

export default maestrosService;
