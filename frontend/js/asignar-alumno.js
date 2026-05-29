document.addEventListener('DOMContentLoaded', () => {

    // Elementos del html (variables a modificar)
    const selectEstudiante = document.getElementById('select-estudiante');
    const selectGrupo = document.getElementById('select-grupo');
    const formAsignar = document.getElementById('form-asignar');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');
    const mensajeExito = document.getElementById('mensaje-exito');

    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
        ? 'http://localhost:3000/api'
        : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api');

    let estudiantesCargados = [];

    // Función para llenar el selector de estudiantes
    async function actualizarSelectorEstudiantes() {
        try {
            const res = await fetch(`${API_BASE}/estudiantes`);
            estudiantesCargados = await res.json();

            selectEstudiante.innerHTML = '<option value="" disabled selected>-- Elige un explorador --</option>';
            if (estudiantesCargados.length === 0) {
                selectEstudiante.innerHTML = '<option value="" disabled selected>No hay estudiantes registrados.</option>';
                return;
            }

            // Filtrar opcionalmente los que ya tienen grupo si se desea, pero aquí los mostramos todos.
            estudiantesCargados.forEach(estudiante => {
                const opcion = document.createElement('option');
                opcion.value = estudiante.idUsuario;
                // Si el alumno ya está en un grupo, se le avisa visualmente
                const textoGrupo = estudiante.grupo ? `(Ya está en: ${estudiante.grupo})` : "(Sin grupo)";
                opcion.textContent = `👤 ${estudiante.nombreCompleto} - ${estudiante.name} ${textoGrupo}`;
                selectEstudiante.appendChild(opcion);
            });
        } catch (error) {
            console.error('Error cargando estudiantes:', error);
            mostrarError('Error al cargar la lista de estudiantes.');
        }
    }

    // Función para llenar el selector de grupos
    async function actualizarSelectorGrupos() {
        try {
            const res = await fetch(`${API_BASE}/grupos`);
            const gruposCargados = await res.json();

            selectGrupo.innerHTML = '<option value="" disabled selected>-- Elige un grupo --</option>';

            if (gruposCargados.length === 0) {
                selectGrupo.innerHTML = '<option value="" disabled selected>No hay grupos creados.</option>';
                return;
            }

            gruposCargados.forEach(grupo => {
                const opcion = document.createElement('option');
                opcion.value = grupo.idGrupo;
                opcion.textContent = `🏫 ${grupo.nombre}`;
                selectGrupo.appendChild(opcion);
            });
        } catch (error) {
            console.error('Error cargando grupos:', error);
            mostrarError('Error al cargar la lista de grupos.');
        }
    }

    // Funciones para mostrar el mensaje de error o éxito
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
        mensajeExito.style.display = 'none';
    }

    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    function mostrarExito(mensaje) {
        mensajeExito.textContent = mensaje;
        mensajeExito.style.display = 'block';
        contenedorError.style.display = 'none';
    }

    // Inicializamos las listas desplegables al cargar la página
    actualizarSelectorEstudiantes();
    actualizarSelectorGrupos();

    // Procesamiento del formulario
    formAsignar.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        ocultarError();
        mensajeExito.style.display = 'none';

        const idEstudiante = selectEstudiante.value;
        const idGrupo = selectGrupo.value;

        if (!idEstudiante) {
            mostrarError('Por favor, selecciona un explorador de la lista.');
            selectEstudiante.focus();
            return;
        }

        if (!idGrupo) {
            mostrarError('Por favor, selecciona un grupo para asignar.');
            selectGrupo.focus();
            return;
        }

        // Validación preventiva visual para avisar si se está reasignando
        const estudianteInfo = estudiantesCargados.find(e => e.idUsuario === idEstudiante);
        if (estudianteInfo && estudianteInfo.grupoKey === idGrupo) {
            mostrarError(`El estudiante ya pertenece actualmente a este grupo.`);
            return;
        }

        try {
            const btnSubmit = formAsignar.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = 'Asignando...';
            btnSubmit.disabled = true;

            const res = await fetch(`${API_BASE}/grupos/${idGrupo}/asignar-alumno`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idAlumno: idEstudiante })
            });

            const data = await res.json();

            btnSubmit.textContent = originalText;
            btnSubmit.disabled = false;

            if (data.success) {
                mostrarExito(data.message || 'Alumno asignado al grupo con éxito.');
                formAsignar.reset();
                // Actualizar listas para reflejar la nueva asignación
                actualizarSelectorEstudiantes();
            } else {
                mostrarError(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error en la asignación:', error);
            mostrarError('Error de conexión con el servidor.');
        }
    });
});