document.addEventListener('DOMContentLoaded', () => {

    // Elementos del html (variables a modificar)
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion-hub');

    // Lógica para el botón de cerrar sesión
    btnCerrarSesion.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
});