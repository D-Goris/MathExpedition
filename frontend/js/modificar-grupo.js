document.addEventListener('DOMContentLoaded', () => {
    // Elementos del html (variables a modificar)
    const selectGrupo = document.getElementById('select-grupo-edicion');
    const contenedorLista = document.getElementById('lista-alumnos-grupo');

    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000'
        ? 'http://localhost:3000/api'
        : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api');

    let gruposDB = [];
    let estudiantesDB = [];

    // Función que carga los grupos y estudiantes de la API
    async function inicializarDatos() {
        try {
            const [resGrupos, resEstudiantes] = await Promise.all([
                fetch(`${API_BASE}/grupos`),
                fetch(`${API_BASE}/estudiantes`)
            ]);
            gruposDB = await resGrupos.json();
            estudiantesDB = await resEstudiantes.json();

            cargarGruposMenu();
        } catch (error) {
            console.error('Error cargando datos:', error);
            selectGrupo.innerHTML = '<option value="">Error cargando grupos</option>';
        }
    }

    // Funcion que carga los grupos disponibles en el menú desplegable.
    function cargarGruposMenu() {
        selectGrupo.innerHTML = '<option value="" disabled selected>-- Elige un grupo --</option>';
        if (gruposDB.length === 0) {
            selectGrupo.innerHTML = '<option value="">No hay grupos disponibles</option>';
            return;
        }
        gruposDB.forEach(grupo => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = grupo.idGrupo;
            nuevaOpcion.textContent = grupo.nombre;
            selectGrupo.appendChild(nuevaOpcion);
        });
    }

    inicializarDatos();
    
    // Función que lee el grupo seleccionado y renderiza a sus integrantes
    function renderizarIntegrantes(idGrupo) {
        if (!idGrupo){
            contenedorLista.innerHTML = '<p class="lista-vacia">📭 Por favor, selecciona un grupo para ver sus estudiantes.</p>';
            return;
        }

        // Filtrar los alumnos que corresponden a este salón
        const alumnosDelGrupo = estudiantesDB.filter(est => est.grupoKey === idGrupo);

        contenedorLista.innerHTML = ''; // Limpiar contenedor

        if (alumnosDelGrupo.length === 0) {
            contenedorLista.innerHTML = '<p class="lista-vacia">📭 Este grupo no tiene estudiantes inscritos actualmente.</p>';
            return;
        }

        alumnosDelGrupo.forEach(alumno => {
            const divFila = document.createElement('div');
            divFila.className = 'fila-alumno-grupo';

            divFila.innerHTML = `
                <div class="info-estudiante">
                    <h4>👦 ${alumno.nombreCompleto}</h4>
                    <span>Usuario: ${alumno.name}</span>
                </div>
                <button type="button" class="btn-remover" data-id="${alumno.idUsuario}">Remover</button>
            `;

            contenedorLista.appendChild(divFila);
        });

        asignarEventosBotones(idGrupo);
    }

    // Escucha el cambio de grupo en el menú desplegable
    selectGrupo.addEventListener('change', (e) => {
        renderizarIntegrantes(e.target.value);
    });

    // Añade la funcionalidad de borrado
    function asignarEventosBotones(idGrupo) {
        const botonesRemover = document.querySelectorAll('.btn-remover');
        
        botonesRemover.forEach(boton => {
            boton.addEventListener('click', async (e) => {
                const idAlumno = e.target.getAttribute('data-id');
                
                try {
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Removiendo...';
                    e.target.disabled = true;

                    const res = await fetch(`${API_BASE}/grupos/${idGrupo}/remover-alumno`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idAlumno })
                    });
                    const data = await res.json();

                    if (data.success) {
                        alert(`¡Modificación exitosa!\nEl alumno fue removido del salón.`);
                        // Refrescar los datos de la API para mostrar los cambios reales
                        await inicializarDatos();
                        // Dejar el select como estaba y re-renderizar
                        selectGrupo.value = idGrupo;
                        renderizarIntegrantes(idGrupo);
                    } else {
                        alert(`Error: ${data.message}`);
                        e.target.textContent = originalText;
                        e.target.disabled = false;
                    }
                } catch (error) {
                    console.error('Error al remover alumno:', error);
                    alert('Error de conexión con el servidor.');
                    e.target.textContent = 'Remover';
                    e.target.disabled = false;
                }
            });
        });
    }
});