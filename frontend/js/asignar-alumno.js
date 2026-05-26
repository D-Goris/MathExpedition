document.addEventListener('DOMContentLoaded', () => {
    // Elementos del HTML
    const formAsignar = document.getElementById('form-assignar-alumno');
    const selectAlumno = document.getElementById('select-alumno');
    const selectGrupo = document.getElementById('select-grupo');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');

    //Variables de simulación de base de datos (Cambiar con el backend real)
    const estudiantesDB = [
        { id: "1", nombre: "Carlos Mendoza", usuario: "ExploradorMate" },
        { id: "2", nombre: "Sofía Rodríguez", usuario: "MathWizard" },
        { id: "3", nombre: "Lucas Gómez", usuario: "ReyNumeros" }
    ];

    const gruposDB = [
        { idKey: "grado3a", nombre: "3er Grado A" },
        { idKey: "grado3b", nombre: "3er Grado B" }
    ];

    //Funcion para cargar las opciones de los select con datos simulados
    function cargarOpcionesMuckup() {
        //Selec de alumnos
        if (estudiantesDB.length === 0) {
            const opcionVacia = document.createElement('option');
            opcionVacia.value = '';
            opcionVacia.textContent = 'No hay alumnos disponibles';
            selectAlumno.appendChild(opcionVacia);
        } else {
        estudiantesDB.forEach(estudiante => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = estudiante.id;
            nuevaOpcion.textContent = `${estudiante.nombre} (${estudiante.usuario})`;
            selectAlumno.appendChild(nuevaOpcion);
        });
        }

        //select de Grupos Escolares
        if (gruposDB.length === 0) {
            const opcionVacia = document.createElement('option');
            opcionVacia.value = '';
            opcionVacia.textContent = 'No hay grupos disponibles';
            selectGrupo.appendChild(opcionVacia);
        } else {
        gruposDB.forEach(grupo => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = grupo.idKey;
            nuevaOpcion.textContent = grupo.nombre;
            selectGrupo.appendChild(nuevaOpcion);
        });
        }
    }

    // Inicializar llenado de los componentes desplegables
    cargarOpcionesMuckup();

    //funciones para mostrar mensajes de error
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    //funcion para ocultar el mensaje de error
    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    // Manejo del envío del formulario
    formAsignar.addEventListener('submit', (evento) => {
        evento.preventDefault();
        ocultarError();

        const idAlumnoSeleccionado = selectAlumno.value;
        const idGrupoSeleccionado = selectGrupo.value;

        // Validación estricta de campos vacíos
        if (!idAlumnoSeleccionado || !idGrupoSeleccionado) {
            mostrarError('Es obligatorio seleccionar un alumno y un grupo de destino.');
            return;
        }

        // Simulación de asignación (Aquí se integraría la lógica real con el backend)

        // Reiniciamos el formulario devolviendo los select a sus placeholders
        formAsignar.reset();
    });
});