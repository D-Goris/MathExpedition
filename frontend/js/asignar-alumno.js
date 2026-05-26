document.addEventListener('DOMContentLoaded', () => {
    const formAsignar = document.getElementById('form-asignar-alumno');
    const selectAlumno = document.getElementById('select-alumno');
    const selectGrupo = document.getElementById('select-grupo');
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

        const idAlumno = selectAlumno.value;
        const idGrupo = selectGrupo.value;

        if (!idAlumno || !idGrupo) {
            mostrarError('Es obligatorio seleccionar un alumno y un grupo de destino.');
            return;
        }

        const nombreAlumno = selectAlumno.options[selectAlumno.selectedIndex].text;
        const nombreGrupo = selectGrupo.options[selectGrupo.selectedIndex].text;

        // --- SIMULACIÓN DE ÉXITO ---
        alert(`¡Asignación completada!\nEl alumno "${nombreAlumno}" ahora pertenece a "${nombreGrupo}".`);
        formAsignar.reset();
    });
});