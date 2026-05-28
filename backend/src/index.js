
const express = require('express');
const controller = require('./controller/Controller');

const app = express();

app.get('/api/ejercicio/:id', controller.conseguirEjercicioPorID);
app.get('/api/mision/:id', controller.cargarEjerciciosDeMision);

//el api esta puesto de manera provicional hasta que se añada un archivo de rutas especificas creo
