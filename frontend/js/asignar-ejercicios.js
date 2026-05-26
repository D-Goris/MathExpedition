document.addEventListener('DOMContentLoaded', () => {

    //Elementos del html a manipular
    const formAsignar = document.getElementById('form-asignar-ejercicios');
    const selectEjercicios = document.getElementById('select-grupo-ejercicios');
    const selectEstudiantes = document.getElementById('select-grupo-estudiantes');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');

    //elementos de prueba para simular la carga dinámica de misiones y grupos desde una base de datos
    //Cambiar cuando tengamos el back
    const misionesDB = [
        { idKey: "mision-sumas", nombre: "Misión 1: Sumas Lúdicas (Aritmética)" },
        { idKey: "mision-formas", nombre: "Misión 2: Reconociendo Polígonos (Geometría)" },
        { idKey: "mision-ecuaciones", nombre: "Misión 3: Introducción a Variables (Álgebra)" }
    ];

    const gruposDB = [
        { idKey: "grado3a", nombre: "3er Grado A" },
        { idKey: "grado3b", nombre: "3er Grado B" },
        { idKey: "grado4a", nombre: "4to Grado A" }
    ];

    //Funcion para cargar dinámicamente las opciones de misiones en los select al cargar la interfaz
    function cargarMisionesMockup() {
        misionesDB.forEach(mision => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = mision.idKey;
            nuevaOpcion.textContent = mision.nombre;
            selectEjercicios.appendChild(nuevaOpcion);
        });
    }

    //Funcion para cargar dinámicamente las opciones de grupos de estudiantes en los select al cargar la interfaz
    function cargarGruposMockup() {
        gruposDB.forEach(grupo => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = grupo.idKey;
            nuevaOpcion.textContent = grupo.nombre;
            selectEstudiantes.appendChild(nuevaOpcion);
        });
    }

    // Inicializar ambas cargas de forma automática al cargar la interfaz
    cargarMisionesMockup();
    cargarGruposMockup();

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
    formAsignar.addEventListener('submit', (evento) => {
        evento.preventDefault();
        ocultarError();

        const valorEjercicios = selectEjercicios.value;
        const valorEstudiantes = selectEstudiantes.value;

        // Validaciones estrictas de campos vacíos
        if (!valorEjercicios) {
            mostrarError('Error: Debes seleccionar un "Grupo de Ejercicios" para enviar.');
            selectEjercicios.focus();
            return;
        }

        if (!valorEstudiantes) {
            mostrarError('Error: Debes seleccionar un "Grupo de Estudiantes" (Salón) de destino.');
            selectEstudiantes.focus();
            return;
        }

        //Cambiar por la lógica real cuando tengamos el back
        // Recuperar nombres legibles para la confirmación en el cliente
        const nombreMision = selectEjercicios.options[selectEjercicios.selectedIndex].text;
        const nombreSalon = selectEstudiantes.options[selectEstudiantes.selectedIndex].text;
        // --- SIMULACIÓN DE ÉXITO ---
        alert(`¡Misión asignada con éxito!\nLos alumnos pertenecientes a "${nombreSalon}" ahora tienen disponible para resolver el paquete de retos: "${nombreMision}".`);
        
        // Reiniciar formulario al estado original
        formAsignar.reset();
    });
});