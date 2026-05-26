document.addEventListener('DOMContentLoaded', () => {

    // 1. Darle funcionalidad a las tarjetas de temas
    const tarjetasTemas = document.querySelectorAll('.tema-card');

    tarjetasTemas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            // Capturamos el tema que el usuario eligió usando el data-tema del HTML
            const temaSeleccionado = tarjeta.getAttribute('data-tema');
            
            // Por ahora mostraremos una alerta amigable, 
            // más adelante aquí harás la redirección al juego o lección (ej: window.location.href = `leccion-${temaSeleccionado}.html`;)
            alert(`¡Genial! Prepárate para tu aventura en ${temaSeleccionado.toUpperCase()}.`);
        });
    });

        // 2. Darle funcionalidad al menú de barra y al Panel Lateral
    // 2. Darle funcionalidad al menú de barra y al Panel Lateral
    const menuBarra = document.querySelector('.menu-barra');
    const panelLateral = document.getElementById('panel-lateral');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    const btnCerrarPanel = document.getElementById('btn-cerrar-panel'); // Capturamos la X

    // Al hacer clic en las 3 rayitas (Abrir)
    menuBarra.addEventListener('click', () => {
        panelLateral.classList.add('abierto');
        menuBarra.classList.add('oculto'); // Escondemos las barritas
    });

    // Al hacer clic en la X (Cerrar)
    btnCerrarPanel.addEventListener('click', () => {
        panelLateral.classList.remove('abierto');
        menuBarra.classList.remove('oculto'); // Mostramos las barritas nuevamente
    });

    // 3. Funcionalidad de Cerrar Sesión (Se mantiene igual)
    btnCerrarSesion.addEventListener('click', () => {
        const confirmar = confirm('¿Estás seguro de que deseas salir de la expedición?');
        
        if (confirmar) {
            window.location.href = 'login.html';
        }
    });
});
