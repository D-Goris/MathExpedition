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
        alert(mensaje);
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
        
        const API_BASE = 'http://localhost:8080/api';

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
                mostrarModalNativo('¡Éxito!', '¡Profesor registrado exitosamente! Redirigiendo al inicio de sesión...', 'exito', () => {
                    window.location.href = 'login.html'; 
                });
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