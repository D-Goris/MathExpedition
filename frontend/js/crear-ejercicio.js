document.addEventListener('DOMContentLoaded', () => {
    
    //Elementos del html que vamos a manipular
    const formEjercicio = document.getElementById('form-crear-ejercicio');
    const selectTema = document.getElementById('tema');
    const inputNuevoTema = document.getElementById('nuevo-tema');
    const textPregunta = document.getElementById('pregunta');
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');
    const inputOpA = document.getElementById('opcion-a');
    const inputOpB = document.getElementById('opcion-b');
    const inputOpC = document.getElementById('opcion-c');
    const inputOpD = document.getElementById('opcion-d');
    const selectCorrecta = document.getElementById('respuesta-correcta');
    
    //ELementos de la base de datos simulada (mockup) para poblar el select de temas (cambiar con el backend real)
    const temasDB = [
        { idKey: "aritmetica", nombre: "Aritmética" },
        { idKey: "algebra", nombre: "Álgebra" },
        { idKey: "geometria", nombre: "Geometría" },
        { idKey: "estadistica", nombre: "Estadística" }  
    ];

    //Funcion para cargar dinámicamente los temas en el select.
    function cargarTemasMockup() {
        temasDB.forEach(tema => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = tema.idKey; // Corregido: usando la variable correcta 'tema'
            nuevaOpcion.textContent = tema.nombre;
            selectTema.appendChild(nuevaOpcion);
        });
        
        // Insertar al final la opción interactiva para añadir temas nuevos
        const opcionNueva = document.createElement('option');
        opcionNueva.value = "nueva";
        opcionNueva.textContent = "➕ Añadir nuevo tema...";
        selectTema.appendChild(opcionNueva);
    }

    // Inicializar el cargado dinámico
    cargarTemasMockup();

    //Funcion para mostrar mensajes de error.
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    //funcion para ocultar el mensaje de error
    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    // Lógica visual para mostrar/ocultar el input de nuevo tema
    selectTema.addEventListener('change', () => {
        if (selectTema.value === 'nueva') {
            inputNuevoTema.style.display = 'block';
            inputNuevoTema.focus();
        } else {
            inputNuevoTema.style.display = 'none';
            inputNuevoTema.value = '';
        }
    });

    // Validación y envío del formulario
    formEjercicio.addEventListener('submit', (evento) => {
        evento.preventDefault();
        ocultarError();

        // Determinar cuál es el tema definitivo que se enviará
        let temaFinal = selectTema.value;
        if (temaFinal === 'nueva') {
            temaFinal = inputNuevoTema.value.trim();
        }

        const pregunta = textPregunta.value.trim();
        const opA = inputOpA.value.trim();
        const opB = inputOpB.value.trim();
        const opC = inputOpC.value.trim();
        const opD = inputOpD.value.trim();
        const correcta = selectCorrecta.value;

        //Validar que ningún campo quede vacío
        if (!temaFinal || !pregunta || !opA || !opB || !opC || !opD || !correcta) {
            mostrarError('Por favor, completa todos los campos del ejercicio y selecciona la respuesta correcta.');
            return;
        }

        //Validar que no existan opciones de respuesta idénticas
        const opciones = [opA, opB, opC, opD];
        const opcionesUnicas = new Set(opciones);
        
        if (opcionesUnicas.size !== opciones.length) {
            mostrarError('Hay opciones de respuesta repetidas. Cada opción debe ser diferente para no confundir al alumno.');
            return;
        }

        // Aquí se construiría el objeto ejercicio con los datos recopilados y se enviaría al backend.


        // Reseteamos el formulario al estado inicial limpio
        formEjercicio.reset();
        inputNuevoTema.style.display = 'none';
    });
});