document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos del html
    const formRegistro = document.getElementById('form-registro');
    const inputNombre = document.getElementById('nombre');
    const inputCorreo = document.getElementById('correo');
    const inputPassword = document.getElementById('password');
    const inputConfirmPassword = document.getElementById('confirm-password');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');
    
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    //procesa el envio del formulario
    formRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault(); 

        ocultarError();

        const nombre = inputNombre.value.trim();
        const correo = inputCorreo.value.trim();
        const password = inputPassword.value;
        const confirmPassword = inputConfirmPassword.value;

        //Validar que no haya campos vacíos
        if (!nombre || !correo || !password || !confirmPassword) {
            mostrarError('Por favor, completa todos los campos.');
            return;
        }

        //Valida si el Correo cumple con el formato
        const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexCorreo.test(correo)) {
            mostrarError('Por favor, ingresa un correo electrónico válido (ejemplo@correo.com).');
            return;
        }

        // Validar seguridad de la contraseña (Mínimo 8 caracteres, 1 mayúscula, 1 número)
        const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regexPassword.test(password)) {
            mostrarError('La contraseña no cumple con los requisitos de seguridad (Mínimo 8 caracteres, una mayúscula y un número).');
            return;
        }

        // Validar que ambas contraseñas coincidan
        if (password !== confirmPassword) {
            mostrarError('Las contraseñas no coinciden. Por favor, verifícalas.');
            return;
        }
        
        // Aquí iría la lógica para enviar los datos al backend y registrar al profesor
        // Por ahora, redirigimos a la página de login como simulación de registro exitoso

        window.location.href = 'login.html'; 
    });
});