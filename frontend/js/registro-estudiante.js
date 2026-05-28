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

        const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
            ? 'http://localhost:3000/api'
            : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api');

        const btnSubmit = formEstudiante.querySelector('button[type="submit"]');
        const textoOriginalBoton = btnSubmit.textContent;
        btnSubmit.textContent = 'Registrando Explorador...';
        btnSubmit.disabled = true;

        fetch(`${API_BASE}/auth/registrar-estudiante`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreCompleto: nombreReal,
                nombrePerfil: perfil,
                password: password
            })
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Error al registrar estudiante.');
            }
            return data;
        })
        .then(data => {
            if (data.success) {
                //alert('¡Explorador registrado con éxito!'); //Comento esto por tema de presentación, pero se puede descomentar para mostrar un mensaje de éxito.
                formEstudiante.reset();
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