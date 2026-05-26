document.addEventListener('DOMContentLoaded', () => {
    
    const formEjercicio = document.getElementById('form-crear-ejercicio');
    const selectTema = document.getElementById('tema');
    const inputNuevoTema = document.getElementById('nuevo-tema');
    const textPregunta = document.getElementById('pregunta');
    
    // Opciones de respuesta
    const inputOpA = document.getElementById('opcion-a');
    const inputOpB = document.getElementById('opcion-b');
    const inputOpC = document.getElementById('opcion-c');
    const inputOpD = document.getElementById('opcion-d');
    
    const selectCorrecta = document.getElementById('respuesta-correcta');
    
    // Contenedor de Alertas de Error
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');

    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    // Lógica visual para mostrar/ocultar el input de nuevo tema
    selectTema.addEventListener('change', () => {
        if (selectTema.value === 'nueva') {
            inputNuevoTema.style.display = 'block';
            inputNuevoTema.focus();
        } else {
            inputNuevoTema.style.display = 'none';
            inputNuevoTema.value = '';
        }
    });

    // Validación y envío del formulario
    formEjercicio.addEventListener('submit', (evento) => {
        evento.preventDefault();
        ocultarError();

        // Determinar cuál es el tema definitivo que se enviará
        let temaFinal = selectTema.value;
        if (temaFinal === 'nueva') {
            temaFinal = inputNuevoTema.value.trim();
        }

        const pregunta = textPregunta.value.trim();
        const opA = inputOpA.value.trim();
        const opB = inputOpB.value.trim();
        const opC = inputOpC.value.trim();
        const opD = inputOpD.value.trim();
        const correcta = selectCorrecta.value;

        // A. Validar que ningún campo quede vacío
        if (!temaFinal || !pregunta || !opA || !opB || !opC || !opD || !correcta) {
            mostrarError('Por favor, completa todos los campos del ejercicio y selecciona la respuesta correcta.');
            return;
        }

        // B. Validar que no existan opciones de respuesta idénticas
        const opciones = [opA, opB, opC, opD];
        const opcionesUnicas = new Set(opciones);
        
        if (opcionesUnicas.size !== opciones.length) {
            mostrarError('Hay opciones de respuesta repetidas. Cada opción debe ser diferente para no confundir al alumno.');
            return;
        }

        // --- SIMULACIÓN DE ÉXITO (Listo para conectar al Backend en el futuro) ---
        alert(`¡Ejercicio guardado con éxito!\nTema asignado: ${temaFinal.toUpperCase()}`);
        
        // Reseteamos el formulario al estado inicial limpio
        formEjercicio.reset();
        inputNuevoTema.style.display = 'none';
    });
});