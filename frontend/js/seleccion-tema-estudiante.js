document.addEventListener('DOMContentLoaded', () => {

    //elementos del html a manipular
    const temasContainer = document.getElementById('temas-container');
    const menuBarra = document.querySelector('.menu-barra');
    const panelLateral = document.getElementById('panel-lateral');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    const btnCerrarPanel = document.getElementById('btn-cerrar-panel');

    //elementos a cambiar cuando se conecte al backend
    const temasDB = [
        { 
            idKey: "aritmetica", 
            titulo: "Aritmética", 
        },
        { 
            idKey: "algebra", 
            titulo: "Álgebra", 
        },
        { 
            idKey: "geometria", 
            titulo: "Geometría", 
        },
        { 
            idKey: "estadistica", 
            titulo: "Estadística", 
        }
    ];

    //Funcion que renderiza las tarjetas de temas en la pantalla, se ejecuta al cargar la interfaz y cada vez que se actualice el array de temas
    function renderizarTarjetasTemas() {
        temasContainer.innerHTML = '';

        temasDB.forEach(tema => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tema-card');
            tarjeta.setAttribute('data-tema', tema.idKey);
            tarjeta.innerHTML = `<h3>${tema.titulo}</h3>`;
            tarjeta.addEventListener('click', () => {
                const temaSeleccionado = tarjeta.getAttribute('data-tema');
                //Logica del backend para cargar los ejercicios del tema seleccionado, por ahora solo muestra un mensaje de alerta
                alert(`¡Genial! Prepárate para tu aventura en ${tema.titulo.toUpperCase()}.`);
                // window.location.href = `pantalla-ejercicios.html?tema=${temaSeleccionado}`;
            });
            
            temasContainer.appendChild(tarjeta);
        });
    }

    // Inicializar las tarjetas en pantalla
    renderizarTarjetasTemas();

    //Funcion para el boton de cerrar sesión, redirige a la pantalla de login
    btnCerrarSesion.addEventListener('click', () => {
            window.location.href = 'login.html'; 
    });
});