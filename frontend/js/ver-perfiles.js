document.addEventListener('DOMContentLoaded', () => {
    // Elementos del html (variables a modificar)
    const contenedorPerfiles = document.getElementById('lista-perfiles-estudiantes');
    const buscador = document.getElementById('buscador-perfiles');

    const API_BASE = 'http://localhost:8080/api';

    let estudiantesDB = [];

    // Función para obtener los estudiantes de la API
    async function obtenerEstudiantes() {
        try {
            const res = await fetch(`${API_BASE}/estudiantes`);
            estudiantesDB = await res.json();
            cargarPerfiles(estudiantesDB);
        } catch (error) {
            console.error('Error cargando perfiles:', error);
            contenedorPerfiles.innerHTML = '<p class="sin-resultados">❌ Error al conectar con el servidor para cargar perfiles.</p>';
        }
    }

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
            
            const grupoDelEstudiante = estudiante.grupo || "";
            const tieneGrupo = grupoDelEstudiante.trim() !== "";
            const textoGrupo = tieneGrupo ? grupoDelEstudiante : "Sin Asignar";
            const claseBadge = tieneGrupo ? "grupo-alumno-badge asignado" : "grupo-alumno-badge sin-asignar";

            divFila.innerHTML = `
                <div class="info-alumno">
                    <h4>👦 ${estudiante.nombreCompleto}</h4>
                    <p>Usuario: <strong>${estudiante.name}</strong></p>
                </div>
                <div class="${claseBadge}">
                    <span>🏫 ${textoGrupo}</span>
                </div>
            `;
            contenedorPerfiles.appendChild(divFila);
        });
    }

    // Inicializar la pantalla cargando perfiles desde el API
    obtenerEstudiantes();

    // LÓGICA DEL BUSCADOR: Permite buscar también por el nombre del grupo
    buscador.addEventListener('input', () => {
        const textoBusqueda = buscador.value.toLowerCase().trim();

        const estudiantesFiltrados = estudiantesDB.filter(estudiante => {
            const nombre = estudiante.nombreCompleto ? estudiante.nombreCompleto.toLowerCase() : "";
            const perfil = estudiante.name ? estudiante.name.toLowerCase() : "";
            const grupo = estudiante.grupo ? estudiante.grupo.toLowerCase() : "";

            return nombre.includes(textoBusqueda) || 
                   perfil.includes(textoBusqueda) ||
                   grupo.includes(textoBusqueda);
        });

        cargarPerfiles(estudiantesFiltrados);
    });
});