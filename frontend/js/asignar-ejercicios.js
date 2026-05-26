document.addEventListener('DOMContentLoaded', () => {
    const formAsignar = document.getElementById('form-asignar-ejercicios');
    const selectEjercicios = document.getElementById('select-grupo-ejercicios');
    const selectEstudiantes = document.getElementById('select-grupo-estudiantes');
    
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');

    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    function ocultarError() {
        contenedorError.style.display = 'none';
    }

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

        // Recuperar nombres legibles para la confirmación
        const nombreMision = selectEjercicios.options[selectEjercicios.selectedIndex].text;
        const nombreSalon = selectEstudiantes.options[selectEstudiantes.selectedIndex].text;

        // --- SIMULACIÓN DE ÉXITO ---
        alert(`¡Misión asignada con éxito!\nLos alumnos pertenecientes a "${nombreSalon}" ahora tienen disponible para resolver el paquete de retos: "${nombreMision}".`);
        
        formAsignar.reset();
    });
});