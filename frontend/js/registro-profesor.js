document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos del html
    const formRegistro = document.getElementById('form-registro');
    const inputNombre = document.getElementById('nombre');
    const inputCorreo = document.getElementById('correo');
    const inputPassword = document.getElementById('password');
    const inputConfirmPassword = document.getElementById('confirm-password');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');
    const mensajeExito = document.getElementById('mensaje-exito');
    
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
        if (mensajeExito) mensajeExito.style.display = 'none';
    }

    function mostrarExito(mensaje) {
        if (mensajeExito) {
            mensajeExito.textContent = mensaje;
            mensajeExito.style.display = 'block';
        }
        contenedorError.style.display = 'none';
    }

    function ocultarMensajes() {
        contenedorError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none';
    }

    //procesa el envio del formulario
    formRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault(); 

        ocultarMensajes();

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
        
        const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
            ? 'http://localhost:3000/api'
            : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api');

        const btnSubmit = formRegistro.querySelector('button[type="submit"]');
        const textoOriginalBoton = btnSubmit.textContent;
        btnSubmit.textContent = 'Registrando...';
        btnSubmit.disabled = true;

        fetch(`${API_BASE}/auth/register-maestro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nombre,
                email: correo,
                password: password
            })
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Error al registrar profesor.');
            }
            return data;
        })
        .then(data => {
            if (data.success) {
                mostrarExito('¡Profesor registrado exitosamente! Redirigiendo al inicio de sesión...');
                setTimeout(() => {
                    window.location.href = 'login.html'; 
                }, 2000);
            } else {
                mostrarError(data.message || 'Error al registrar.');
            }
        })
        .catch(err => {
            console.error('Error en registro:', err);
            mostrarError(err.message || 'Error de conexión con el servidor.');
        })
        .finally(() => {
            btnSubmit.textContent = textoOriginalBoton;
            btnSubmit.disabled = false;
        });
    });
});