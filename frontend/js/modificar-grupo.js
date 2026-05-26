document.addEventListener('DOMContentLoaded', () => {
    const selectGrupo = document.getElementById('select-grupo-edicion');
    const contenedorLista = document.getElementById('lista-alumnos-grupo');

    // Simulación de Base de Datos Relacional (Alumnos enlazados a IDs de grupos)
    let asignacionesDB = [
        { idAlumno: 1, nombre: "Carlos Mendoza", usuario: "ExploradorMate", grupoKey: "grado3a" },
        { idAlumno: 2, nombre: "Sofía Rodríguez", usuario: "MathWizard", grupoKey: "grado3b" },
        { idAlumno: 4, nombre: "Ana Martínez", usuario: "DeltaMath", grupoKey: "grado3a" }
    ];

    // Función que lee el grupo seleccionado y renderiza a sus integrantes
    function renderizarIntegrantes(grupoKey) {
        if (!grupoKey) return;

        // Filtrar los alumnos que corresponden a este salón
        const alumnosDelGrupo = asignacionesDB.filter(item => item.grupoKey === grupoKey);

        contenedorLista.innerHTML = ''; // Limpiar contenedor

        // Caso: El grupo existe pero no tiene ningún alumno asignado aún
        if (alumnosDelGrupo.length === 0) {
            contenedorLista.innerHTML = '<p class="lista-vacia">📭 Este grupo no tiene estudiantes inscritos actualmente.</p>';
            return;
        }

        // Renderizar cada alumno con su respectivo botón de modificación
        alumnosDelGrupo.forEach(alumno => {
            const divFila = document.createElement('div');
            divFila.className = 'fila-alumno-grupo';

            divFila.innerHTML = `
                <div class="info-estudiante">
                    <h4>👦 ${alumno.nombre}</h4>
                    <span>Usuario: ${alumno.usuario}</span>
                </div>
                <button type="button" class="btn-remover" data-id="${alumno.idAlumno}">Remover</button>
            `;

            contenedorLista.appendChild(divFila);
        });

        // Asignar listeners a los nuevos botones de remover inyectados
        asignarEventosBotones(grupoKey);
    }

    // Escucha el cambio de grupo en el menú desplegable
    selectGrupo.addEventListener('change', (e) => {
        renderizarIntegrantes(e.target.value);
    });

    // Añade la funcionalidad de borrado lógico a los botones
    function asignarEventosBotones(grupoKey) {
        const botonesRemover = document.querySelectorAll('.btn-remover');
        
        botonesRemover.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idParaQuitar = parseInt(e.target.getAttribute('data-id'));
                
                // Encontrar el nombre del estudiante para personalizar la alerta
                const alumnoObjetivo = asignacionesDB.find(item => item.idAlumno === idParaQuitar);
                
                if (confirm(`¿Estás seguro de que deseas remover a "${alumnoObjetivo.nombre}" de este grupo escolar?`)) {
                    
                    // ACCIÓN: Modificamos el registro de la BD simulada (Saca al alumno del grupo)
                    asignacionesDB = asignacionesDB.filter(item => item.idAlumno !== idParaQuitar);
                    
                    // Mensaje de éxito del sistema
                    alert(`¡Modificación exitosa!\nEl alumno fue removido del salón.`);
                    
                    // Refrescar la pantalla inmediatamente con los datos actualizados
                    renderizarIntegrantes(grupoKey);
                }
            });
        });
    }
});