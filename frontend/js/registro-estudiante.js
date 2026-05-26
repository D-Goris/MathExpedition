document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos del html
    const formEstudiante = document.getElementById('form-registro-estudiante');
    const inputNombreReal = document.getElementById('nombre-real');
    const inputPerfil = document.getElementById('perfil');
    const inputPassword = document.getElementById('password');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');

    // Función para mostrar el contenedor de error (Mensaje de error)
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    // Función para ocultar el contenedor de error (Mensaje de error)
    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    // Procesa el envío del formulario
    formEstudiante.addEventListener('submit', (evento) => {
        evento.preventDefault();
        ocultarError();
        const nombreReal = inputNombreReal.value.trim();
        const perfil = inputPerfil.value.trim();
        const password = inputPassword.value;

        // Validar que no haya campos vacíos
        if (!nombreReal || !perfil || !password) {
            mostrarError('Por favor, completa todos los campos del estudiante.');
            return;
        }

        // Validar que el nombre de perfil (usuario) no tenga espacios internos
        if (perfil.includes(' ')) {
            mostrarError('El Nombre de Perfil no puede contener espacios (Ej: Usa AnaExploradora en lugar de Ana Exploradora).');
            return;
        }

        // Validar longitud de la contraseña para el alumno (6 caracteres mínimo)
        if (password.length < 6) {
            mostrarError('La contraseña del estudiante debe tener al menos 6 caracteres.');
            return;
        }

        //logica de guardado de datos del estudiantes (backend)
        
        formEstudiante.reset();
    });
});