document.addEventListener('DOMContentLoaded', () => {
    // Elementos del html (variables a modificar)
    const contenedorPerfiles = document.getElementById('lista-perfiles-estudiantes');
    const buscador = document.getElementById('buscador-perfiles');

    // Simulación de Base de Datos de Alumnos (Proviene del back)
    const estudiantesDB = [
        { nombreCompleto: "Carlos Mendoza", nombrePerfil: "ExploradorMate", grupo: "3er Grado A" },
        { nombreCompleto: "Sofía Rodríguez", nombrePerfil: "MathWizard", grupo: "3er Grado B" },
        { nombreCompleto: "Lucas Gómez", nombrePerfil: "ReyNumeros", grupo: "" },
        { nombreCompleto: "Ana Martínez", nombrePerfil: "DeltaMath", grupo: "3er Grado A" }
    ];

    // Función para renderizar perfiles en el HTML
    function cargarPerfiles(listaEstudiantes) {
        contenedorPerfiles.innerHTML = ''; 

        //Caso por si la lista traida esta vacia.
        if (listaEstudiantes.length === 0) {
            contenedorPerfiles.innerHTML = '<p class="sin-resultados">❌ No se encontraron exploradores con ese criterio.</p>';
            return;
        }

        // Iteración para crear cada perfil de estudiante.
        listaEstudiantes.forEach(estudiante => {
            const divFila = document.createElement('div');
            divFila.className = 'fila-perfil';
            
            const tieneGrupo = estudiante.grupo.trim() !== "";
            const textoGrupo = tieneGrupo ? estudiante.grupo : "Sin Asignar";
            const claseBadge = tieneGrupo ? "grupo-alumno-badge asignado" : "grupo-alumno-badge sin-asignar";

            divFila.innerHTML = `
                <div class="info-alumno">
                    <h4>👦 ${estudiante.nombreCompleto}</h4>
                    <p>Usuario: <strong>${estudiante.nombrePerfil}</strong></p>
                </div>
                <div class="${claseBadge}">
                    <span>🏫 ${textoGrupo}</span>
                </div>
            `;
            contenedorPerfiles.appendChild(divFila);
        });
    }

    // Inicializar la pantalla
    cargarPerfiles(estudiantesDB);

    // LÓGICA DEL BUSCADOR: Permite buscar también por el nombre del grupo (No hace falta cambiarlo con el back)
    buscador.addEventListener('input', () => {
        const textoBusqueda = buscador.value.toLowerCase().trim();

        const estudiantesFiltrados = estudiantesDB.filter(estudiante => {
            return estudiante.nombreCompleto.toLowerCase().includes(textoBusqueda) || 
                   estudiante.nombrePerfil.toLowerCase().includes(textoBusqueda) ||
                   estudiante.grupo.toLowerCase().includes(textoBusqueda);
        });

        cargarPerfiles(estudiantesFiltrados);
    });
});