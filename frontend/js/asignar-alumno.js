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
        mensajeExito.style.display = 'none';
        contenedorError.style.display = 'none';
        mostrarModalNativo('¡Éxito!', mensaje);
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

    function mostrarModalNativo(titulo, mensaje, tipo = 'exito', onClose = null) {
        const fondo = document.createElement('div');
        fondo.style.position = 'fixed'; fondo.style.top = '0'; fondo.style.left = '0';
        fondo.style.width = '100vw'; fondo.style.height = '100vh';
        fondo.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        fondo.style.display = 'flex'; fondo.style.justifyContent = 'center'; fondo.style.alignItems = 'center';
        fondo.style.zIndex = '9999';

        const caja = document.createElement('div');
        caja.style.backgroundColor = 'white'; caja.style.padding = '30px';
        caja.style.borderRadius = '12px'; caja.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        caja.style.textAlign = 'center'; caja.style.maxWidth = '400px'; caja.style.width = '90%';
        
        const icono = document.createElement('div');
        icono.innerHTML = tipo === 'exito' ? '✅' : 'ℹ️';
        icono.style.fontSize = '40px'; icono.style.marginBottom = '15px';
        
        const h3 = document.createElement('h3');
        h3.textContent = titulo; h3.style.color = '#1f2937';
        h3.style.marginBottom = '10px'; h3.style.fontSize = '1.5rem';

        const p = document.createElement('p');
        p.textContent = mensaje; p.style.color = '#4b5563';
        p.style.marginBottom = '20px'; p.style.lineHeight = '1.5';

        const btnOk = document.createElement('button');
        btnOk.textContent = 'Aceptar';
        btnOk.style.backgroundColor = '#3b82f6'; btnOk.style.color = 'white';
        btnOk.style.border = 'none'; btnOk.style.padding = '10px 25px';
        btnOk.style.borderRadius = '6px'; btnOk.style.cursor = 'pointer';
        btnOk.style.fontSize = '1rem'; btnOk.style.fontWeight = 'bold';
        
        btnOk.onclick = () => { document.body.removeChild(fondo); if (onClose) onClose(); };

        caja.appendChild(icono); caja.appendChild(h3); caja.appendChild(p); caja.appendChild(btnOk);
        fondo.appendChild(caja); document.body.appendChild(fondo);
        btnOk.focus();
    }
});