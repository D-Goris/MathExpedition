document.addEventListener('DOMContentLoaded', () => {
    const textoDocente = document.getElementById('nombre-docente');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion-hub');

    // Simulación de lectura de datos de sesión (Frontend Mockup)
    const docenteLogueado = localStorage.getItem('usuario_profesor') || "Educador";
    textoDocente.textContent = `Prof. ${docenteLogueado}`;

    // Lógica para el botón de cerrar sesión
    btnCerrarSesion.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas salir del Panel de MathExpedition?')) {
            localStorage.removeItem('usuario_profesor');
            // Redirección simulada a la pantalla de login unificado
            window.location.href = 'login.html';
        }
    });
});