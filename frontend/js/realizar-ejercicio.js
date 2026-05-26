document.addEventListener('DOMContentLoaded', () => {
    // Elementos del html a manipular
    const textoEnunciado = document.getElementById('texto-enunciado');
    const opcionesTarjetas = document.querySelectorAll('.opcion-tarjeta');
    const btnEnviar = document.getElementById('btn-enviar-respuesta');
    const btnVolverMenu = document.getElementById('btn-volver-menu');
    const textoA = document.getElementById('opcion-texto-a');
    const textoB = document.getElementById('opcion-texto-b');
    const textoC = document.getElementById('opcion-texto-c');
    const textoD = document.getElementById('opcion-texto-d');
    const bloqueOpciones = document.getElementById('bloque-opciones');
    const bloqueResultado = document.getElementById('bloque-resultado');
    const mensajeResultado = document.getElementById('mensaje-resultado');
    const btnSiguiente = document.getElementById('btn-siguiente-pregunta');

    //Variables necesarios para la logica
    let opcionSeleccionada = null;
    let preguntaActualIndex = 0;

    // BANCO DE PREGUNTAS SIMULADO (Aumentado para probar el botón "Siguiente") (cambiar cuando backend esté listo)
    const preguntasDB = [
        {
            enunciado: "Si Juan tiene 3 manzanas y Pedro le regala el doble de lo que tiene, ¿Cuántas manzanas tiene Juan en total ahora?",
            opcionA: "6 manzanas", opcionB: "9 manzanas", opcionC: "12 manzanas", opcionD: "5 manzanas",
            respuestaCorrecta: "B"
        },
        {
            enunciado: "En un salón hay 4 mesas. Si cada mesa tiene 5 sillas, ¿Cuántas sillas hay en total en el salón?",
            opcionA: "20 sillas", opcionB: "9 sillas", opcionC: "15 sillas", opcionD: "25 sillas",
            respuestaCorrecta: "A"
        }
    ];

    // Carga la pregunta actual limpiando estados antiguos
    function cargarPregunta() {
        const pregunta = preguntasDB[preguntaActualIndex];
        
        textoEnunciado.textContent = pregunta.enunciado;
        textoA.textContent = pregunta.opcionA;
        textoB.textContent = pregunta.opcionB;
        textoC.textContent = pregunta.opcionC;
        textoD.textContent = pregunta.opcionD;
        opcionSeleccionada = null;
        bloqueOpciones.classList.remove('bloqueado');
        bloqueResultado.classList.add('oculto');
        bloqueResultado.classList.remove('exito', 'fallo');
        btnEnviar.classList.remove('oculto');

        opcionesTarjetas.forEach(t => {
            t.classList.remove('seleccionada', 'correcta', 'incorrecta');
        });
    }

    // Oyente de selección de tarjetas
    opcionesTarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            opcionesTarjetas.forEach(t => t.classList.remove('seleccionada'));
            tarjeta.classList.add('seleccionada');
            opcionSeleccionada = tarjeta.getAttribute('data-opcion');
        });
    });

    // COMPROBACIÓN VISUAL (Sin Alerts molesto)
    btnEnviar.addEventListener('click', () => {
        if (!opcionSeleccionada) {
            return;
        }

        const preguntaInfo = preguntasDB[preguntaActualIndex];
        bloqueOpciones.classList.add('bloqueado');
        btnEnviar.classList.add('oculto');
        bloqueResultado.classList.remove('oculto');

        const tarjetaElegida = document.querySelector(`.opcion-tarjeta[data-opcion="${opcionSeleccionada}"]`);
        const tarjetaCorrecta = document.querySelector(`.opcion-tarjeta[data-opcion="${preguntaInfo.respuestaCorrecta}"]`);

        if (opcionSeleccionada === preguntaInfo.respuestaCorrecta) {
            // Caso Éxito
            bloqueResultado.classList.add('exito');
            mensajeResultado.innerHTML = "🎉 ¡Excelente trabajo explorador! Tu respuesta es correcta.";
            tarjetaElegida.classList.add('correcta');
        } else {
            // Caso Fallo
            bloqueResultado.classList.add('fallo');
            mensajeResultado.innerHTML = `🧭 ¡Oh no! Revisa tus cálculos. La respuesta correcta era la (${preguntaInfo.respuestaCorrecta}).`;
            tarjetaElegida.classList.add('incorrecta');
            tarjetaCorrecta.classList.add('correcta');
        }
    });

    // ACCIÓN DEL BOTÓN SIGUIENTE
    btnSiguiente.addEventListener('click', () => {
        preguntaActualIndex++;

        // Si todavía quedan preguntas en el banco, carga la siguiente
        if (preguntaActualIndex < preguntasDB.length) {
            cargarPregunta();
        } else {
            // Si ya no hay más preguntas, la lección terminó y vuelve al mapa
            window.location.href = 'seleccion-tema-estudiante.html';
        }
    });

    // Botón Volver normal
    btnVolverMenu.addEventListener('click', () => {
            window.location.href = 'seleccion-tema-estudiante.html';
    });

    // Primera carga al abrir
    cargarPregunta();
});