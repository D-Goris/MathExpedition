document.addEventListener('DOMContentLoaded', () => {

    //Elementos del html a manipular
    const formAsignar = document.getElementById('form-asignar-ejercicios');
    const selectEjercicios = document.getElementById('select-grupo-ejercicios');
    const selectEstudiantes = document.getElementById('select-grupo-estudiantes');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');

    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
        ? 'http://localhost:3000/api'
        : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api');

    //Funcion para cargar dinámicamente las opciones de misiones en los select al cargar la interfaz
    async function cargarMisiones() {
        try {
            const res = await fetch(`${API_BASE}/misiones`);
            const misionesDB = await res.json();
            
            selectEjercicios.innerHTML = '<option value="" disabled selected>-- Selecciona un paquete de misión --</option>';
            if (misionesDB.length === 0) {
                selectEjercicios.innerHTML = '<option value="" disabled selected>No hay misiones disponibles</option>';
                return;
            }

            misionesDB.forEach(mision => {
                const nuevaOpcion = document.createElement('option');
                nuevaOpcion.value = mision.idMision;
                nuevaOpcion.textContent = `Misión: ${mision.nombre}`;
                selectEjercicios.appendChild(nuevaOpcion);
            });
        } catch (error) {
            console.error('Error cargando misiones:', error);
            mostrarError('Error al cargar misiones.');
        }
    }

    //Funcion para cargar dinámicamente las opciones de grupos de estudiantes en los select al cargar la interfaz
    async function cargarGrupos() {
        try {
            const res = await fetch(`${API_BASE}/grupos`);
            const gruposDB = await res.json();
            
            selectEstudiantes.innerHTML = '<option value="" disabled selected>-- Elige un salón destino --</option>';
            if (gruposDB.length === 0) {
                selectEstudiantes.innerHTML = '<option value="" disabled selected>No hay grupos disponibles</option>';
                return;
            }

            gruposDB.forEach(grupo => {
                const nuevaOpcion = document.createElement('option');
                nuevaOpcion.value = grupo.idGrupo;
                nuevaOpcion.textContent = grupo.nombre;
                selectEstudiantes.appendChild(nuevaOpcion);
            });
        } catch (error) {
            console.error('Error cargando grupos:', error);
            mostrarError('Error al cargar grupos.');
        }
    }

    // Inicializar ambas cargas de forma automática al cargar la interfaz
    cargarMisiones();
    cargarGrupos();

    //funciones para mostrar mensajes de error en la interfaz
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    //funcion para ocultar el mensaje de error
    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    //funcion para manejar el evento de envío del formulario.
    formAsignar.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        ocultarError();

        const idMision = selectEjercicios.value;
        const idGrupo = selectEstudiantes.value;

        // Validaciones estrictas de campos vacíos
        if (!idMision) {
            mostrarError('Error: Debes seleccionar un "Grupo de Ejercicios" para enviar.');
            selectEjercicios.focus();
            return;
        }

        if (!idGrupo) {
            mostrarError('Error: Debes seleccionar un "Grupo de Estudiantes" (Salón) de destino.');
            selectEstudiantes.focus();
            return;
        }

        try {
            const btnSubmit = formAsignar.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = 'Asignando...';
            btnSubmit.disabled = true;

            const res = await fetch(`${API_BASE}/grupos/${idGrupo}/asignar-mision`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idMision: idMision })
            });

            const data = await res.json();
            
            btnSubmit.textContent = originalText;
            btnSubmit.disabled = false;

            if (data.success) {
                const nombreMision = selectEjercicios.options[selectEjercicios.selectedIndex].text;
                const nombreSalon = selectEstudiantes.options[selectEstudiantes.selectedIndex].text;
                alert(`¡Misión asignada con éxito!\nLos alumnos pertenecientes a "${nombreSalon}" ahora tienen disponible para resolver el paquete de retos: "${nombreMision}".`);
                formAsignar.reset();
            } else {
                mostrarError(`Error al asignar: ${data.message}`);
            }
        } catch (error) {
            console.error('Error asignando mision:', error);
            mostrarError('Error de conexión con el servidor.');
        }
    });
});