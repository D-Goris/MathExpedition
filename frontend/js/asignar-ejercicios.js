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

    const mensajeExito = document.getElementById('mensaje-exito');

    //funciones para mostrar mensajes de error en la interfaz
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
        if (mensajeExito) mensajeExito.style.display = 'none';
    }

    function mostrarExito(mensaje) {
        if (mensajeExito) {
            mensajeExito.style.display = 'none';
        }
        contenedorError.style.display = 'none';
        mostrarModalNativo('¡Éxito!', mensaje);
    }

    //funcion para ocultar el mensaje de error
    function ocultarMensajes() {
        contenedorError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none';
    }

    //funcion para manejar el evento de envío del formulario.
    formAsignar.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        ocultarMensajes();

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
                mostrarExito(`¡Misión asignada con éxito! Los alumnos de "${nombreSalon}" ahora tienen disponible "${nombreMision}".`);
                formAsignar.reset();
            } else {
                mostrarError(`Error al asignar: ${data.message}`);
            }
        } catch (error) {
            console.error('Error asignando mision:', error);
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