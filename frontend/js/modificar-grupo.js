document.addEventListener('DOMContentLoaded', () => {
    // Elementos del html (variables a modificar)
    const selectGrupo = document.getElementById('select-grupo-edicion');
    const contenedorLista = document.getElementById('lista-alumnos-grupo');

    const API_BASE = 'http://localhost:8080/api';

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
        ocultarMensajes();
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

    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');

    function mostrarExito(msj) {
        if (mensajeExito) {
            mensajeExito.style.display = 'none';
        }
        if (mensajeError) mensajeError.style.display = 'none';
        mostrarModalNativo('¡Éxito!', msj);
    }

    function mostrarError(msj) {
        if (mensajeError) {
            mensajeError.textContent = msj;
            mensajeError.style.display = 'block';
        }
        if (mensajeExito) mensajeExito.style.display = 'none';
    }

    function ocultarMensajes() {
        if (mensajeExito) mensajeExito.style.display = 'none';
        if (mensajeError) mensajeError.style.display = 'none';
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
                    ocultarMensajes();
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
                        mostrarExito(`¡El alumno fue removido del salón!`);
                        // Refrescar los datos de la API para mostrar los cambios reales
                        await inicializarDatos();
                        // Dejar el select como estaba y re-renderizar
                        selectGrupo.value = idGrupo;
                        renderizarIntegrantes(idGrupo);
                    } else {
                        mostrarError(`Error: ${data.message}`);
                        e.target.textContent = originalText;
                        e.target.disabled = false;
                    }
                } catch (error) {
                    console.error('Error al remover alumno:', error);
                    mostrarError('Error de conexión con el servidor.');
                    e.target.textContent = 'Remover';
                    e.target.disabled = false;
                }
            });
        });
    }

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