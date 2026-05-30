// import authService from './auth.service.js';

const authController = {};
const JAVA_API = 'http://localhost:8080/api/java/auth';

authController.login = async (req, res) => {
    const { identificador, password, rol } = req.body;

    if (!identificador || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Faltan credenciales obligatorias.' 
        });
    }

    try {
        const response = await fetch(`${JAVA_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identificador, password, rol })
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

authController.registrarEstudiante = async (req, res) => {
    const { nombreCompleto, nombrePerfil, password } = req.body;

    if (!nombreCompleto || !nombrePerfil || !password) {
        return res.status(400).json({ success: false, message: 'Faltan datos obligatorios para el registro.' });
    }

    try {
        const response = await fetch(`${JAVA_API}/registro-estudiante`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCompleto, nombrePerfil, password })
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

authController.registrarMaestro = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios (nombre, correo o contraseña)' });
    }

    try {
        const response = await fetch(`${JAVA_API}/registro-maestro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Java backend no disponible' });
    }
};

export default authController;