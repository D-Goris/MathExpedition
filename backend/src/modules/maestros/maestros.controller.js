import maestrosService from './maestros.service.js';

const maestrosController = {};

maestrosController.obtenerPerfil = (req, res) => {
    try {
        const idUsuario = req.params.id;
        const resultado = maestrosService.obtenerPerfil(idUsuario);

        if (resultado.error) {
            return res.status(404).json({ success: false, message: resultado.error });
        }

        res.status(200).json({ success: true, perfil: resultado });
    } catch (error) {
        console.error('Error al obtener perfil del profesor:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export default maestrosController;
