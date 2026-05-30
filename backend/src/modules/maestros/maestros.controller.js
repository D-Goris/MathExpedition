// import maestrosService from './maestros.service.js';

const maestrosController = {};
const JAVA_API = 'http://localhost:8080/api/java/maestros';

maestrosController.obtenerPerfil = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const response = await fetch(`${JAVA_API}/${idUsuario}/perfil`);
        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener perfil del profesor:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export default maestrosController;
