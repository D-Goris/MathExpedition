import Server from './app/server.js'; 

const server = new Server();
server.listen();

const express = require('express');
const controller = require('./controller/Controller');

const app = express();

app.get('/api/ejercicio/:id', controller.conseguirEjercicioPorID);
app.get('/api/mision/:id', controller.cargarEjerciciosDeMision);