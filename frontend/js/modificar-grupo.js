document.addEventListener('DOMContentLoaded', () => {
    // // Elementos del html (variables a modificar)
    const selectGrupo = document.getElementById('select-grupo-edicion');
    const contenedorLista = document.getElementById('lista-alumnos-grupo');

    //Elementos de la base de datos simulada (variables a modificar)
    const gruposDB = [
        { idKey: "grado3a", nombre: "3er Grado A" },
        { idKey: "grado3b", nombre: "3er Grado B" }
    ];

    let asignacionesDB = [
        { idAlumno: 1, nombre: "Carlos Mendoza", usuario: "ExploradorMate", grupoKey: "grado3a" },
        { idAlumno: 2, nombre: "Sofía Rodríguez", usuario: "MathWizard", grupoKey: "grado3b" },
        { idAlumno: 4, nombre: "Ana Martínez", usuario: "DeltaMath", grupoKey: "grado3a" }
    ];

    //Funcion que carga los grupos disponibles en el menú desplegable.
    function cargarGruposMockup() {
        if (gruposDB.length === 0) {
            selectGrupo.innerHTML = '<option value="">No hay grupos disponibles</option>';
            return;
        }
        gruposDB.forEach(grupo => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = grupo.idKey;
            nuevaOpcion.textContent = grupo.nombre;
            selectGrupo.appendChild(nuevaOpcion);
        });
    }

    // Inicializar el menú desplegable de salones
    cargarGruposMockup();
    
    // Función que lee el grupo seleccionado y renderiza a sus integrantes
    function renderizarIntegrantes(grupoKey) {
        if (!grupoKey){
            contenedorLista.innerHTML = '<p class="lista-vacia">📭 Por favor, selecciona un grupo para ver sus estudiantes.</p>';
            return;
        }

        // Filtrar los alumnos que corresponden a este salón
        const alumnosDelGrupo = asignacionesDB.filter(item => item.grupoKey === grupoKey);

        contenedorLista.innerHTML = ''; // Limpiar contenedor

        //El grupo existe pero no tiene ningún alumno asignado aún
        if (alumnosDelGrupo.length === 0) {
            contenedorLista.innerHTML = '<p class="lista-vacia">📭 Este grupo no tiene estudiantes inscritos actualmente.</p>';
            return;
        }

        // EL grupo existe y tiene alumnos asignados, por lo que se renderizan normalmente.
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
                
                //Todo este codigo se tiene que eliminar cuando se integre con la base de datos real, ya que el backend se encargará de hacer la modificación y devolver el resultado actualizado.
                // Encontrar el nombre del estudiante para personalizar la alerta
                const alumnoObjetivo = asignacionesDB.find(item => item.idAlumno === idParaQuitar);    
                // ACCIÓN: Modificamos el registro de la BD simulada (Saca al alumno del grupo)
                asignacionesDB = asignacionesDB.filter(item => item.idAlumno !== idParaQuitar);
                // Mensaje de éxito del sistema
                alert(`¡Modificación exitosa!\nEl alumno fue removido del salón.`);
                    

                
                // Refrescar la pantalla inmediatamente con los datos actualizados
                renderizarIntegrantes(grupoKey);

            });
        });
    }
});