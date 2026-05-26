document.addEventListener('DOMContentLoaded', () => {
    const formCrearGrupo = document.getElementById('form-crear-grupo');
    const inputNombre = document.getElementById('nombre-grupo');
    const textDescripcion = document.getElementById('descripcion-grupo');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');
    const listaContenedor = document.getElementById('lista-grupos-disponibles');

    // Simulación de Base de Datos inicial (Grupos ya creados previamente)
    const baseDatosGrupos = [
        { nombre: "3er Grado A", descripcion: "Clase matutina de matemáticas básicas." },
        { nombre: "4to Grado B", descripcion: "Salón avanzado para resolución de problemas de lógica." }
    ];

    // Función para renderizar los grupos en la lista disponible
    function actualizarListaGrupos() {
        listaContenedor.innerHTML = ''; // Limpiamos el contenedor
        
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

    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    // Inicializamos la pantalla mostrando los grupos pre-existentes
    actualizarListaGrupos();

    // Procesamiento del formulario siguiendo la ERS
    formCrearGrupo.addEventListener('submit', (evento) => {
        evento.preventDefault();
        ocultarError();

        const nombreValor = inputNombre.value.trim();
        const descripcionValor = textDescripcion.value.trim();

        // 1. ERS: Validar que no contengan campos vacíos con errores específicos
        if (!nombreValor) {
            mostrarError('Error en el campo: "Nombre del Grupo". No puede estar vacío.');
            inputNombre.focus();
            return;
        }

        if (!descripcionValor) {
            mostrarError('Error en el campo: "Descripción del Grupo". No puede estar vacío.');
            textDescripcion.focus();
            return;
        }

        // 2. ERS: Asegurarse de que no exista un grupo creado previamente con esa misma información (nombre idéntico)
        const grupoDuplicado = baseDatosGrupos.find(
            grupo => grupo.nombre.toLowerCase() === nombreValor.toLowerCase()
        );

        if (grupoDuplicado) {
            mostrarError(`Error en el campo "Nombre del Grupo": El grupo "${nombreValor}" ya existe en el sistema.`);
            inputNombre.focus();
            return;
        }

        // 3. ERS: Guardar la información si pasa las validaciones
        const nuevoGrupo = {
            nombre: nombreValor,
            descripcion: descripcionValor
        };
        baseDatosGrupos.push(nuevoGrupo);

        // 4. ERS: Mostrar correctamente en la lista de grupos disponibles
        actualizarListaGrupos();

        // Reseteo limpio del formulario
        formCrearGrupo.reset();
        alert('¡Grupo creado exitosamente y añadido a la lista disponible!');
    });
});