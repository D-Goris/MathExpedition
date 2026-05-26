document.addEventListener('DOMContentLoaded', () => {

    // Elementos del html (variables a modificar)
    const formCrearGrupo = document.getElementById('form-crear-grupo');
    const inputNombre = document.getElementById('nombre-grupo');
    const textDescripcion = document.getElementById('descripcion-grupo');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');
    const listaContenedor = document.getElementById('lista-grupos-disponibles');

    // Simulación de Base de Datos inicial (Modificar con el backend posteriormente)
    const baseDatosGrupos = [
        { nombre: "3er Grado A", descripcion: "Clase matutina de matemáticas básicas." },
        { nombre: "4to Grado B", descripcion: "Salón avanzado para resolución de problemas de lógica." }
    ];

    // Función para renderizar los grupos en la lista disponible
    function actualizarListaGrupos() {
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
    formCrearGrupo.addEventListener('submit', (evento) => {
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

        //Valida que no exista un grupo creado previamente con esa misma información (nombre idéntico)
        const grupoDuplicado = baseDatosGrupos.find(
            grupo => grupo.nombre.toLowerCase() === nombreValor.toLowerCase()
        );

        if (grupoDuplicado) {
            mostrarError(`Error en el campo "Nombre del Grupo": El grupo "${nombreValor}" ya existe en el sistema.`);
            inputNombre.focus();
            return;
        }

        //Guardar la información si pasa las validaciones (logica a cambiar en el futuro para conectar con el backend)
        //Esto se deberia eliminar y solo guardar en el backend, pero se deja aquí para simular la creación de grupos y mostrarlo en la lista de grupos disponibles.
        const nuevoGrupo = {
            nombre: nombreValor,
            descripcion: descripcionValor
        };
        baseDatosGrupos.push(nuevoGrupo);

        // Actualizar la lista de grupos disponibles con el nuevo grupo creado
        actualizarListaGrupos();

        // Reseteo limpio del formulario
        formCrearGrupo.reset();
    });
});