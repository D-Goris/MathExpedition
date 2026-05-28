import authService from './auth.service.js';

const authController = {};

authController.login = (req, res) => {
    // 1. Capturamos exactamente lo que login.js envía (identificador, password, rol)
    const { identificador, password, rol } = req.body;

    // Validación preventiva en el servidor
    if (!identificador || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Faltan credenciales obligatorias.' 
        });
    }

    // 2. Enviamos los datos al servicio para buscarlo en el JSON correcto
    const resultado = authService.autenticarUsuario(identificador, password, rol);

    // Caso A: El usuario no existe en la base de datos
    if (resultado === null) {
        return res.status(404).json({ 
            success: false, 
            message: 'El usuario no se encuentra registrado.' 
        });
    }

    // Caso B: El usuario existe pero la contraseña está mal
    if (resultado.error) {
        return res.status(401).json({ 
            success: false, 
            message: resultado.error 
        });
    }

    // Caso C: Inicio de sesión correcto (Envolvemos en success y user como pide login.js)
    return res.status(200).json({
        success: true,
        user: resultado
    });
};

authController.registrarEstudiante = (req, res) => {
    // Recibimos los datos con los nombres claros desde el frontend
    const { nombreCompleto, nombrePerfil, password } = req.body;

    if (!nombreCompleto || !nombrePerfil || !password) {
        return res.status(400).json({ success: false, message: 'Faltan datos obligatorios para el registro.' });
    }

    const resultado = authService.registrarEstudiante({ nombreCompleto, nombrePerfil, password });

    if (resultado.error) {
        return res.status(400).json({ success: false, message: resultado.error });
    }

    // Respuesta exitosa que activará el "data.success" en tu frontend
    return res.status(201).json({ 
        success: true, 
        message: '¡Explorador registrado con éxito!', 
        usuario: resultado 
    });
};

authController.registrarMaestro = (req, res) => {
    // Capturamos exactamente las variables que envía tu archivo 'registro-profesor.js'
    const { name, email, password } = req.body;

    // Validación preventiva de seguridad en el servidor
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios (nombre, correo o contraseña)' });
    }

    const resultado = authService.registrarMaestro({ name, email, password });

    // Si el servicio detecta un correo duplicado, responde con error
    if (resultado.error) {
        return res.status(400).json({ success: false, message: resultado.error });
    }

    // Respondemos con estatus 201 (Creado) y la estructura "success: true" que espera el Frontend
    return res.status(201).json({ 
        success: true, 
        message: '¡Profesor registrado exitosamente!', 
        usuario: resultado 
    });
};

export default authController;