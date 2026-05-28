document.addEventListener('DOMContentLoaded', () => {

    //elementos del html a manipular
    const temasContainer = document.getElementById('temas-container');
    const menuBarra = document.querySelector('.menu-barra');
    const panelLateral = document.getElementById('panel-lateral');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    const btnCerrarPanel = document.getElementById('btn-cerrar-panel');

    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
        ? 'http://localhost:3000/api'
        : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api');

    async function cargarMisionesDelEstudiante() {
        const usuarioRaw = localStorage.getItem('usuarioLogueado');
        if (!usuarioRaw) {
            window.location.href = 'login.html';
            return;
        }

        const usuario = JSON.parse(usuarioRaw);
        const idUsuario = usuario._idUsuario || usuario.idUsuario || usuario.id;

        try {
            // 1. Obtener las misiones asignadas al grupo del estudiante
            const resAsignadas = await fetch(`${API_BASE}/estudiantes/${idUsuario}/misiones`);
            const dataAsignadas = await resAsignadas.json();

            temasContainer.innerHTML = '';

            if (!dataAsignadas.success || !dataAsignadas.misionesIds || dataAsignadas.misionesIds.length === 0) {
                temasContainer.innerHTML = `
                    <div style="text-align: center; color: white; padding: 2rem;">
                        <h3>📭 Aún no tienes misiones asignadas</h3>
                        <p>Tu grupo (${dataAsignadas.grupo || 'Ninguno'}) no tiene misiones activas por ahora. ¡Pregúntale a tu maestro!</p>
                    </div>
                `;
                return;
            }

            const misionesIds = dataAsignadas.misionesIds;

            // 2. Obtener los detalles de todas las misiones y filtrar las asignadas
            const resMisiones = await fetch(`${API_BASE}/misiones`);
            const todasLasMisiones = await resMisiones.json();

            const misionesDisponibles = todasLasMisiones.filter(m => misionesIds.includes(m.idMision));

            if (misionesDisponibles.length === 0) {
                temasContainer.innerHTML = '<p style="color:white;">No se encontraron los detalles de tus misiones asignadas.</p>';
                return;
            }

            renderizarTarjetasTemas(misionesDisponibles);

        } catch (error) {
            console.error('Error cargando misiones:', error);
            temasContainer.innerHTML = '<p style="color:white;">Error al cargar las misiones desde el servidor.</p>';
        }
    }

    //Funcion que renderiza las tarjetas de temas en la pantalla
    function renderizarTarjetasTemas(misiones) {
        temasContainer.innerHTML = '';

        misiones.forEach(mision => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tema-card');
            tarjeta.setAttribute('data-tema', mision.idMision);
            tarjeta.innerHTML = `<h3>Misión: ${mision.nombre}</h3>`;
            
            tarjeta.addEventListener('click', () => {
                const temaSeleccionado = tarjeta.getAttribute('data-tema');
                // Redirigir a realizar ejercicio pasando el ID de la misión en la URL
                window.location.href = `realizar-ejercicio.html?mision=${temaSeleccionado}`;
            });
            
            temasContainer.appendChild(tarjeta);
        });
    }

    // Inicializar la carga
    cargarMisionesDelEstudiante();

    //Funcion para el boton de cerrar sesión, redirige a la pantalla de login
    btnCerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogueado');
        localStorage.removeItem('rolUsuario');
        window.location.href = 'login.html'; 
    });
});