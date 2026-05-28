import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rutaGrupos = path.join(__dirname, '../../data/grupos.json');

const gruposService = {};

gruposService.obtenerGrupos = () => {
    return JSON.parse(fs.readFileSync(rutaGrupos, 'utf-8'));
};

gruposService.crearGrupo = (nombre, descripcion) => {
    const grupos = JSON.parse(fs.readFileSync(rutaGrupos, 'utf-8'));

    if (grupos.find(g => g.nombre.toLowerCase() === nombre.toLowerCase())) {
        return { error: 'El grupo ya existe' };
    }

    const nuevoId = 'grupo-' + Date.now(); // ID único

    const nuevoGrupo = {
        idGrupo: nuevoId,
        nombre,
        descripcion,
        estudiantesIds: [],
        misionesIds: []
    };

    grupos.push(nuevoGrupo);
    fs.writeFileSync(rutaGrupos, JSON.stringify(grupos, null, 2), 'utf-8');

    return nuevoGrupo;
};

gruposService.asignarAlumno = (idGrupo, idAlumno) => {
    const grupos = JSON.parse(fs.readFileSync(rutaGrupos, 'utf-8'));
    const grupo = grupos.find(g => g.idGrupo === idGrupo);

    if (!grupo) return { error: 'Grupo no encontrado' };

    // Remove student from any other group first
    grupos.forEach(g => {
        g.estudiantesIds = g.estudiantesIds.filter(id => id !== idAlumno);
    });

    // Add to the new group
    grupo.estudiantesIds.push(idAlumno);
    
    fs.writeFileSync(rutaGrupos, JSON.stringify(grupos, null, 2), 'utf-8');
    return grupo;
};

gruposService.removerAlumno = (idGrupo, idAlumno) => {
    const grupos = JSON.parse(fs.readFileSync(rutaGrupos, 'utf-8'));
    const grupo = grupos.find(g => g.idGrupo === idGrupo);

    if (!grupo) return { error: 'Grupo no encontrado' };

    grupo.estudiantesIds = grupo.estudiantesIds.filter(id => id !== idAlumno);

    fs.writeFileSync(rutaGrupos, JSON.stringify(grupos, null, 2), 'utf-8');
    return grupo;
};

gruposService.asignarMision = (idGrupo, idMision) => {
    const grupos = JSON.parse(fs.readFileSync(rutaGrupos, 'utf-8'));
    const grupo = grupos.find(g => g.idGrupo === idGrupo);

    if (!grupo) return { error: 'Grupo no encontrado' };

    if (!grupo.misionesIds.includes(Number(idMision))) {
        grupo.misionesIds.push(Number(idMision));
    }

    fs.writeFileSync(rutaGrupos, JSON.stringify(grupos, null, 2), 'utf-8');
    return grupo;
};

export default gruposService;
