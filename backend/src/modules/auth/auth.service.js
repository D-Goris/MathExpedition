import fs from 'fs';
import path from 'path';

const authService = {};

const rutaEstudiantes = path.resolve('./data/estudiantes.json');
const rutaMaestros = path.resolve('./data/maestros.json');

authService.autenticarUsuario = (idUsuario, password) => {
    const estudiantes = JSON.parse(fs.readFileSync(rutaEstudiantes, 'utf-8'));
    const maestros = JSON.parse(fs.readFileSync(rutaMaestros, 'utf-8'));

    // Búsqueda en Estudiantes
    const estudianteEncontrado = estudiantes.find(e => e.idUsuario === idUsuario);
    if (estudianteEncontrado) {
        if (estudianteEncontrado.password === password) {
            return {
                idUsuario: estudianteEncontrado.idUsuario,
                name: estudianteEncontrado.name,
                rol: 'estudiante'
            };
        }
        return { error: 'Contraseña incorrecta' };
    }

    // Búsqueda en Maestros
    const maestroEncontrado = maestros.find(m => m.idUsuario === idUsuario);
    if (maestroEncontrado) {
        if (maestroEncontrado.password === password) {
            return {
                idUsuario: maestroEncontrado.idUsuario,
                name: maestroEncontrado.name,
                rol: 'maestro'
            };
        }
        return { error: 'Contraseña incorrecta' };
    }

    return null;
};

export default authService;