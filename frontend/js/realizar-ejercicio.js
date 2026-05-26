document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const textoEnunciado = document.getElementById('texto-enunciado');
    const opcionesTarjetas = document.querySelectorAll('.opcion-tarjeta');
    const btnEnviar = document.getElementById('btn-enviar-respuesta');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');

    // Referencias para actualizar los textos de las opciones dinámicamente
    const textoA = document.getElementById('opcion-texto-a');
    const textoB = document.getElementById('opcion-texto-b');
    const textoC = document.getElementById('opcion-texto-c');
    const textoD = document.getElementById('opcion-texto-d');

    let opcionSeleccionada = null;

    // =========================================================================
    // PARTE 1: COMENTARIO DE INTEGRACIÓN FUTURA CON EL BACKEND (PETICIÓN/FETCH)
    // =========================================================================
    /* [CONEXIÓN BACKEND FUTURA - OBTENER EJERCICIO]
       En lugar de usar el objeto 'ejercicioMock' estático definido abajo, aquí se 
       realizará una llamada fetch a tu API REST para obtener un 
       ejercicio de la Base de Datos.
       
       Ejemplo de implementación futura:
       
       const idMisionActual = localStorage.getItem('mision_activa');
       
       fetch(`/api/ejercicios/obtener?mision=${idMisionActual}`)
           .then(response => response.json())
           .then(data => {
               // Aquí mapearías las variables con los datos de la base de datos:
               textoEnunciado.textContent = data.enunciado;
               textoA.textContent = data.opciones.A;
               textoB.textContent = data.opciones.B;
               // ...etc
           })
           .catch(err => mostrarError('Error de red: No se pudo conectar.'));
    */

    // --- Datos de Prueba Simulados ---
    const ejercicioMock = {
        id: 501,
        tema: "geometria",
        enunciado: "En una expedición por la selva geométrica, encuentras un cofre ancestral cerrado con un candado rúnico. Si la inscripción dice que el perímetro de un escudo perfectamente triangular equilátero mide 24 cm, ¿cuánto mide cada uno de sus lados?",
        opciones: {
            A: "6 cm",
            B: "8 cm",
            C: "12 cm",
            D: "10 cm"
        },
        respuestaCorrecta: "B" // 24 / 3 = 8
    };

    // Función para renderizar el ejercicio simulado en la interfaz
    function inicializarEjercicio() {
        textoEnunciado.textContent = ejercicioMock.enunciado;
        textoA.textContent = ejercicioMock.opciones.A;
        textoB.textContent = ejercicioMock.opciones.B;
        textoC.textContent = ejercicioMock.opciones.C;
        textoD.textContent = ejercicioMock.opciones.D;
    }

    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    // --- Manejo del Evento Click en las Tarjetas de Opciones ---
    opcionesTarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            ocultarError();
            
            // Quitar el estado 'seleccionada' de todas las demás opciones
            opcionesTarjetas.forEach(t => t.classList.remove('seleccionada'));
            
            // Marcar visualmente la opción sobre la que se hizo click
            tarjeta.classList.add('seleccionada');
            
            // Almacenar el identificador de la opción elegida (A, B, C o D)
            opcionSeleccionada = tarjeta.getAttribute('data-opcion');
        });
    });

    // --- Validación y Procesamiento de la Respuesta al hacer click en Comprobar ---
    btnEnviar.addEventListener('click', () => {
        ocultarError();

        // Validación estricta en el Frontend: Asegurar que el alumno seleccionó algo
        if (!opcionSeleccionada) {
            mostrarError('¡Atención explorador! Debes seleccionar una opción antes de comprobar la respuesta.');
            return;
        }

        // =========================================================================
        // PARTE 2: COMENTARIO DE INTEGRACIÓN FUTURA CON EL BACKEND (VERIFICACIÓN)
        // =========================================================================
        /* [CONEXIÓN BACKEND FUTURA - ENVÍO Y VERIFICACIÓN DE RESPUESTA]
           La validación final NO debe hacerse en el navegador del cliente. 
           Aquí enviarás la respuesta del alumno al Backend para validar y actualizar 
           su puntuación en la Base de Datos.
           
           Ejemplo de implementación futura:
           
           fetch('/api/progreso/validar-respuesta', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                   ejercicioId: ejercicioMock.id,
                   opcionElegida: opcionSeleccionada
               })
           })
           .then(res => res.json())
           .then(resultado => {
               if (resultado.esCorrecto) {
                   alert('¡Excelente! Sumaste monedas.');
               } else {
                   alert('Respuesta incorrecta. Inténtalo de nuevo.');
               }
           });
        */

        // --- Evaluación de Éxito Simulada de forma Local ---
        if (opcionSeleccionada === ejercicioMock.respuestaCorrecta) {
            alert(`¡Excelente trabajo explorador! 🎉\nLa respuesta "${opcionSeleccionada}" es CORRECTA. Has superado el reto arquitectónico.`);
            // Limpiar
            opcionesTarjetas.forEach(t => t.classList.remove('seleccionada'));
            opcionSeleccionada = null;
        } else {
            alert(`¡Oh no! La respuesta elegida es incorrecta. 🧭\nRevisa tus cálculos con cuidado y vuelve a intentar.`);
        }
    });

    // Inicializar los datos
    inicializarEjercicio();
});