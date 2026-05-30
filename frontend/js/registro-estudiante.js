document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos del html
    const formEstudiante = document.getElementById('form-registro-estudiante');
    const inputNombreReal = document.getElementById('nombre-real');
    const inputPerfil = document.getElementById('perfil');
    const inputPassword = document.getElementById('password');
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
            mensajeExito.style.display = 'none'; // ocultamos el texto nativo
        }
        contenedorError.style.display = 'none';
        mostrarModalNativo('¡Éxito!', mensaje);
    }

    function ocultarMensajes() {
        contenedorError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none';
    }

    // Procesa el envío del formulario
    formEstudiante.addEventListener('submit', (evento) => {
        evento.preventDefault();
        ocultarMensajes();
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
                mostrarExito('¡Explorador registrado con éxito!');
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

    function mostrarModalNativo(titulo, mensaje, tipo = 'exito', onClose = null) {
        const fondo = document.createElement('div');
        fondo.style.position = 'fixed'; fondo.style.top = '0'; fondo.style.left = '0';
        fondo.style.width = '100vw'; fondo.style.height = '100vh';
        fondo.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        fondo.style.display = 'flex'; fondo.style.justifyContent = 'center'; fondo.style.alignItems = 'center';
        fondo.style.zIndex = '9999';

        const caja = document.createElement('div');
        caja.style.backgroundColor = 'white'; caja.style.padding = '30px';
        caja.style.borderRadius = '12px'; caja.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        caja.style.textAlign = 'center'; caja.style.maxWidth = '400px'; caja.style.width = '90%';
        
        const icono = document.createElement('div');
        icono.innerHTML = tipo === 'exito' ? '✅' : 'ℹ️';
        icono.style.fontSize = '40px'; icono.style.marginBottom = '15px';
        
        const h3 = document.createElement('h3');
        h3.textContent = titulo; h3.style.color = '#1f2937';
        h3.style.marginBottom = '10px'; h3.style.fontSize = '1.5rem';

        const p = document.createElement('p');
        p.textContent = mensaje; p.style.color = '#4b5563';
        p.style.marginBottom = '20px'; p.style.lineHeight = '1.5';

        const btnOk = document.createElement('button');
        btnOk.textContent = 'Aceptar';
        btnOk.style.backgroundColor = '#3b82f6'; btnOk.style.color = 'white';
        btnOk.style.border = 'none'; btnOk.style.padding = '10px 25px';
        btnOk.style.borderRadius = '6px'; btnOk.style.cursor = 'pointer';
        btnOk.style.fontSize = '1rem'; btnOk.style.fontWeight = 'bold';
        
        btnOk.onclick = () => { document.body.removeChild(fondo); if (onClose) onClose(); };

        caja.appendChild(icono); caja.appendChild(h3); caja.appendChild(p); caja.appendChild(btnOk);
        fondo.appendChild(caja); document.body.appendChild(fondo);
        btnOk.focus();
    }
});