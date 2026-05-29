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
    const contenedorPrincipal = document.querySelector('main');

    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
        ? 'http://localhost:3000/api'
        : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api');

    //Variables necesarios para la logica
    let opcionSeleccionada = null;
    let preguntaActualIndex = 0;
    let preguntasDB = [];
    let idMision = new URLSearchParams(window.location.search).get('mision');

    const usuarioRaw = localStorage.getItem('usuarioLogueado');
    if (!usuarioRaw) {
        window.location.href = 'login.html';
        return;
    }
    const usuario = JSON.parse(usuarioRaw);
    const idUsuario = usuario._idUsuario || usuario.idUsuario || usuario.id;

    async function iniciarMision() {
        if (!idMision) {
            contenedorPrincipal.innerHTML = '<div style="text-align: center; color: white; padding: 2rem;"><h2>⚠️ Misión no válida</h2><p>Vuelve al menú y selecciona una misión válida.</p></div>';
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/misiones/${idMision}/ejercicios`);
            if (!res.ok) throw new Error('Error al obtener ejercicios');
            const data = await res.json();

            preguntasDB = data;

            if (preguntasDB.length === 0) {
                contenedorPrincipal.innerHTML = '<div style="text-align: center; color: white; padding: 2rem;"><h2>📭 Misión Vacía</h2><p>Esta misión aún no tiene retos para ti.</p></div>';
                return;
            }

            cargarPregunta();
        } catch (error) {
            console.error('Error:', error);
            contenedorPrincipal.innerHTML = '<div style="text-align: center; color: white; padding: 2rem;"><h2>❌ Error</h2><p>Hubo un problema de conexión con el servidor.</p></div>';
        }
    }

    // Carga la pregunta actual limpiando estados antiguos
    function cargarPregunta() {
        const pregunta = preguntasDB[preguntaActualIndex];

        textoEnunciado.textContent = pregunta.enunciado;
        // Los ejercicios en el backend tienen opciones.A, opciones.B, etc.
        textoA.textContent = pregunta.opciones ? pregunta.opciones.A : pregunta.opcionA;
        textoB.textContent = pregunta.opciones ? pregunta.opciones.B : pregunta.opcionB;
        textoC.textContent = pregunta.opciones ? pregunta.opciones.C : pregunta.opcionC;
        textoD.textContent = pregunta.opciones ? pregunta.opciones.D : pregunta.opcionD;

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
            if (bloqueOpciones.classList.contains('bloqueado')) return;
            opcionesTarjetas.forEach(t => t.classList.remove('seleccionada'));
            tarjeta.classList.add('seleccionada');
            opcionSeleccionada = tarjeta.getAttribute('data-opcion');
        });
    });

    // COMPROBACIÓN VISUAL Y GUARDADO
    btnEnviar.addEventListener('click', async () => {
        if (!opcionSeleccionada) {
            return;
        }

        const preguntaInfo = preguntasDB[preguntaActualIndex];
        const respuestaCorrecta = preguntaInfo.respuestaCorrecta;

        bloqueOpciones.classList.add('bloqueado');
        btnEnviar.classList.add('oculto');
        bloqueResultado.classList.remove('oculto');

        const tarjetaElegida = document.querySelector(`.opcion-tarjeta[data-opcion="${opcionSeleccionada}"]`);
        const tarjetaCorrecta = document.querySelector(`.opcion-tarjeta[data-opcion="${respuestaCorrecta}"]`);

        if (opcionSeleccionada === respuestaCorrecta) {
            // Caso Éxito
            bloqueResultado.classList.add('exito');
            mensajeResultado.innerHTML = "🎉 ¡Excelente trabajo explorador! Tu respuesta es correcta.";
            tarjetaElegida.classList.add('correcta');

            // Llamada al backend para guardar el progreso
            try {
                await fetch(`${API_BASE}/estudiantes/${idUsuario}/avance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idEjercicio: preguntaInfo.id })
                });
            } catch (err) {
                console.error('No se pudo guardar el progreso:', err);
            }

        } else {
            // Caso Fallo
            bloqueResultado.classList.add('fallo');
            mensajeResultado.innerHTML = `🧭 ¡Oh no! Revisa tus cálculos. La respuesta correcta era la (${respuestaCorrecta}).`;
            tarjetaElegida.classList.add('incorrecta');
            if (tarjetaCorrecta) tarjetaCorrecta.classList.add('correcta');
        }
    });

    // ACCIÓN DEL BOTÓN SIGUIENTE
    btnSiguiente.addEventListener('click', () => {
        preguntaActualIndex++;

        // Si todavía quedan preguntas en el banco, carga la siguiente
        if (preguntaActualIndex < preguntasDB.length) {
            cargarPregunta();
        } else {
            // Si ya no hay más preguntas, muestra mensaje de victoria y un botón para volver
            contenedorPrincipal.innerHTML = `
                <div style="text-align: center; color: black; padding: 3rem;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">🎉 ¡Misión Completada!</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 2rem;">Has completado todos los ejercicios de esta misión con éxito explorador.</p>
                    <button id="btn-volver-final" class="btn-siguiente" style="font-size: 1.2rem; padding: 15px 30px;">Volver al Mapa</button>
                </div>
            `;
            document.getElementById('btn-volver-final').addEventListener('click', () => {
                window.location.href = 'seleccion-tema-estudiante.html';
            });
        }
    });

    // Botón Volver normal
    btnVolverMenu.addEventListener('click', () => {
        window.location.href = 'seleccion-tema-estudiante.html';
    });

    // Primera carga al abrir
    iniciarMision();
});