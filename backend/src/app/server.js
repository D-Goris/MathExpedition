// src/app/server.js
import express from 'express';
import cors from 'cors';
import indexRouter from '../routes/index.routes.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        this.paths = {
            api: '/api'
        };

        //Inicializar Middlewares
        this.middlewares();

        //Inicializar Rutas de la aplicación
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json()); // Permite recibir el formato JSON en el body del Login
    }

    routes() {
        // Enlaza el enrutador central
        this.app.use(this.paths.api, indexRouter);

        // Captura de rutas inexistentes (404)
        this.app.use((req, res) => {
            res.status(404).json({ msg: 'Ruta no encontrada en la API de MathExpedition' });
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo con éxito en http://localhost:${this.port}`);
        });
    }
}

export default Server;