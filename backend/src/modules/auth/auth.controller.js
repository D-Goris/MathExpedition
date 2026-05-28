import authService from './auth.service.js';

const authController = {};

// Maneja la petición de inicio de sesión
authController.login = (req, res) => {
    const { idUsuario, password } = req.body;

    // Validación básica preventiva
    if (!idUsuario || !password) {
        return res.status(400).json({ msg: 'Faltan credenciales obligatorias' });
    }

    const resultado = authService.autenticarUsuario(idUsuario, password);

    // Caso A: El usuario no existe en ningún JSON
    if (resultado === null) {
        return res.status(404).json({ msg: 'El usuario no se encuentra registrado' });
    }

    // Caso B: Existe pero la contraseña falló
    if (resultado.error) {
        return res.status(401).json({ msg: resultado.error });
    }

    // Caso C: Todo correcto, devolvemos la sesión y el rol asignado
    return res.status(200).json(resultado);
};

export default authController;