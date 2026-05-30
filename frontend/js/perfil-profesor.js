document.addEventListener('DOMContentLoaded', () => {

    const contenedorPerfil = document.getElementById('contenedor-perfil');
    const contenedorCarga = document.getElementById('contenedor-carga');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');

    const perfilNombre = document.getElementById('perfil-nombre');
    const perfilCorreo = document.getElementById('perfil-correo');
    const perfilId = document.getElementById('perfil-id');

    const API_BASE = 'http://localhost:8080/api';

    function mostrarError(mensaje) {
        contenedorCarga.style.display = 'none';
        contenedorPerfil.style.display = 'none';
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    async function cargarPerfil() {
        const usuarioRaw = localStorage.getItem('usuarioLogueado');
        if (!usuarioRaw) {
            window.location.href = 'login.html';
            return;
        }

        const usuario = JSON.parse(usuarioRaw);
        const idUsuario = usuario._idUsuario || usuario.idUsuario || usuario.id;

        try {
            const res = await fetch(`${API_BASE}/maestros/${idUsuario}`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Error al cargar los datos del perfil.');
            }

            const perfil = data.perfil;

            // Renderizar los datos en la interfaz
            perfilNombre.textContent = perfil.name || 'Sin nombre';
            perfilCorreo.textContent = perfil.email || 'Sin correo';
            perfilId.textContent = perfil.idUsuario;

            // Cambiar la vista
            contenedorCarga.style.display = 'none';
            contenedorPerfil.style.display = 'block';

        } catch (error) {
            console.error('Error al obtener perfil:', error);
            mostrarError(error.message || 'Error de conexión con el servidor.');
        }
    }

    // Iniciar carga al cargar la página
    cargarPerfil();
});
