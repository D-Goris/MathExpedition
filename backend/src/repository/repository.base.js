import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data');

export const leerJSON = (archivo) => {
    const ruta = path.join(dataPath, archivo);
    if (!fs.existsSync(ruta)) {
        console.warn(`El archivo ${archivo} no existe. Se devolverá un arreglo vacío.`);
        return [];
    }

    const contenido = fs.readFileSync(ruta, 'utf-8');
    if (!contenido.trim()) return [];

    try {
        return JSON.parse(contenido);
    } catch (error) {
        console.error(`Error al parsear el archivo ${archivo}:`, error);
        return [];
    }
};

export const guardarJSON = (archivo, datos) => {
    const ruta = path.join(dataPath, archivo);
    try {
        fs.writeFileSync(ruta, JSON.stringify(datos, null, 4), 'utf-8');
        return true;
    } catch (error) {
        console.error(`Error al guardar el archivo ${archivo}:`, error);
        return false;
    }
};
