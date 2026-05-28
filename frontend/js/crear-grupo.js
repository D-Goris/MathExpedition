document.addEventListener('DOMContentLoaded', () => {

    // Elementos del html (variables a modificar)
    const formCrearGrupo = document.getElementById('form-crear-grupo');
    const inputNombre = document.getElementById('nombre-grupo');
    const textDescripcion = document.getElementById('descripcion-grupo');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');
    const listaContenedor = document.getElementById('lista-grupos-disponibles');

    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
        ? 'http://localhost:3000/api'
        : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api');

    // Función para renderizar los grupos en la lista disponible
    async function actualizarListaGrupos() {
        try {
            const res = await fetch(`${API_BASE}/grupos`);
            const baseDatosGrupos = await res.json();

            listaContenedor.innerHTML = '';
            
            if(baseDatosGrupos.length === 0) {
                listaContenedor.innerHTML = '<p>No hay grupos disponibles. ¡Crea el primero!</p>';
                return;
            }

            baseDatosGrupos.forEach(grupo => {
                const divTarjeta = document.createElement('div');
                divTarjeta.className = 'tarjeta-grupo';
                
                divTarjeta.innerHTML = `
                    <h4>📌 ${grupo.nombre}</h4>
                    <p>${grupo.descripcion}</p>
                `;
                listaContenedor.appendChild(divTarjeta);
            });
        } catch (error) {
            console.error('Error cargando grupos:', error);
            listaContenedor.innerHTML = '<p>Error al cargar los grupos desde el servidor.</p>';
        }
    }

    // Funciones para mostrar y el mensaje de error
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    // Función para ocultar el mensaje de error
    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    // Inicializamos la lista de estudiantes disponibles al cargar la página
    actualizarListaGrupos();

    // Procesamiento del formulario
    formCrearGrupo.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        ocultarError();

        const nombreValor = inputNombre.value.trim();
        const descripcionValor = textDescripcion.value.trim();

        //Validar que no contengan campos vacíos en el nombre
        if (!nombreValor) {
            mostrarError('Error en el campo: "Nombre del Grupo". No puede estar vacío.');
            inputNombre.focus();
            return;
        }

        //Validar que no contengan campos vacíos en la descripción
        if (!descripcionValor) {
            mostrarError('Error en el campo: "Descripción del Grupo". No puede estar vacío.');
            textDescripcion.focus();
            return;
        }

        try {
            const btnSubmit = formCrearGrupo.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = 'Creando...';
            btnSubmit.disabled = true;

            const res = await fetch(`${API_BASE}/grupos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nombreValor, descripcion: descripcionValor })
            });

            const data = await res.json();
            
            btnSubmit.textContent = originalText;
            btnSubmit.disabled = false;

            if (data.success) {
                formCrearGrupo.reset();
                actualizarListaGrupos();
            } else {
                mostrarError(`Error al crear: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al crear grupo:', error);
            mostrarError('Error de conexión con el servidor.');
        }
    });
});