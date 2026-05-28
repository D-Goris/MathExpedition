document.addEventListener('DOMContentLoaded', () => {
    
    //Elementos del html que vamos a manipular
    const formEjercicio = document.getElementById('form-crear-ejercicio');
    const selectTema = document.getElementById('tema');
    const inputNuevoTema = document.getElementById('nuevo-tema');
    const textPregunta = document.getElementById('pregunta');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');
    const inputOpA = document.getElementById('opcion-a');
    const inputOpB = document.getElementById('opcion-b');
    const inputOpC = document.getElementById('opcion-c');
    const inputOpD = document.getElementById('opcion-d');
    const selectCorrecta = document.getElementById('respuesta-correcta');
    
    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
        ? 'http://localhost:3000/api'
        : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api');

    //Funcion para cargar dinámicamente las misiones (temas)
    async function cargarTemas() {
        try {
            const res = await fetch(`${API_BASE}/misiones`);
            const misionesDB = await res.json();
            
            selectTema.innerHTML = '<option value="" disabled selected>-- Elige una Misión / Tema --</option>';

            misionesDB.forEach(mision => {
                const nuevaOpcion = document.createElement('option');
                nuevaOpcion.value = mision.idMision;
                nuevaOpcion.textContent = mision.nombre;
                selectTema.appendChild(nuevaOpcion);
            });
            
            // Insertar al final la opción interactiva para añadir temas nuevos (futuro feature)
            const opcionNueva = document.createElement('option');
            opcionNueva.value = "nueva";
            opcionNueva.textContent = "➕ Añadir nuevo tema... (No disponible aún)";
            selectTema.appendChild(opcionNueva);
        } catch (error) {
            console.error('Error cargando temas:', error);
            mostrarError('Error al conectar con el servidor.');
        }
    }

    // Inicializar el cargado dinámico
    cargarTemas();

    //Funcion para mostrar mensajes de error.
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    //funcion para ocultar el mensaje de error
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
    formEjercicio.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        ocultarError();

        // Determinar cuál es el tema definitivo que se enviará
        let temaFinal = selectTema.value;
        if (temaFinal === 'nueva') {
            mostrarError('La creación de nuevas misiones no está implementada en esta versión.');
            return;
        }

        const pregunta = textPregunta.value.trim();
        const opA = inputOpA.value.trim();
        const opB = inputOpB.value.trim();
        const opC = inputOpC.value.trim();
        const opD = inputOpD.value.trim();
        const correcta = selectCorrecta.value;

        //Validar que ningún campo quede vacío
        if (!temaFinal || !pregunta || !opA || !opB || !opC || !opD || !correcta) {
            mostrarError('Por favor, completa todos los campos del ejercicio y selecciona la respuesta correcta.');
            return;
        }

        //Validar que no existan opciones de respuesta idénticas
        const opciones = [opA, opB, opC, opD];
        const opcionesUnicas = new Set(opciones);
        
        if (opcionesUnicas.size !== opciones.length) {
            mostrarError('Hay opciones de respuesta repetidas. Cada opción debe ser diferente para no confundir al alumno.');
            return;
        }

        try {
            const btnSubmit = formEjercicio.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = 'Guardando...';
            btnSubmit.disabled = true;

            const res = await fetch(`${API_BASE}/misiones/${temaFinal}/ejercicios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pregunta, opA, opB, opC, opD, correcta })
            });

            const data = await res.json();
            
            btnSubmit.textContent = originalText;
            btnSubmit.disabled = false;

            if (res.ok) {
                alert('¡Ejercicio guardado exitosamente en la misión!');
                formEjercicio.reset();
                inputNuevoTema.style.display = 'none';
            } else {
                mostrarError(`Error al guardar: ${data.msg || 'Desconocido'}`);
            }
        } catch (error) {
            console.error('Error al enviar ejercicio:', error);
            mostrarError('Error de conexión con el servidor.');
        }
    });
});