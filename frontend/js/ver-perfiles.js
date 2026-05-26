document.addEventListener('DOMContentLoaded', () => {
    const contenedorPerfiles = document.getElementById('lista-perfiles-estudiantes');
    const buscador = document.getElementById('buscador-perfiles');

    // Simulación de Base de Datos de Alumnos (Sin contraseñas visibles - RNF Compliant)
    const estudiantesDB = [
        { nombreCompleto: "Carlos Mendoza", nombrePerfil: "ExploradorMate", grupo: "3er Grado A" },
        { nombreCompleto: "Sofía Rodríguez", nombrePerfil: "MathWizard", grupo: "3er Grado B" },
        { nombreCompleto: "Lucas Gómez", nombrePerfil: "ReyNumeros", grupo: "" }, // Caso sin asignar para pruebas
        { nombreCompleto: "Ana Martínez", nombrePerfil: "DeltaMath", grupo: "3er Grado A" }
    ];

    // Función para renderizar perfiles en el HTML
    function cargarPerfiles(listaEstudiantes) {
        contenedorPerfiles.innerHTML = ''; 

        if (listaEstudiantes.length === 0) {
            contenedorPerfiles.innerHTML = '<p class="sin-resultados">❌ No se encontraron exploradores con ese criterio.</p>';
            return;
        }

        listaEstudiantes.forEach(estudiante => {
            const divFila = document.createElement('div');
            divFila.className = 'fila-perfil';

            // Evaluación del estado del grupo
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

    // LÓGICA DEL BUSCADOR: Permite buscar también por el nombre del grupo
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