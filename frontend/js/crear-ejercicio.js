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
    const mensajeExito = document.getElementById('mensaje-exito');
    
    const API_BASE = 'http://localhost:8080/api';

    //Funcion para cargar dinámicamente las misiones (temas)
    async function cargarTemas() {
        try {
            const res = await fetch(`${API_BASE}/misiones`);
            const misionesDB = await res.json();
            
            selectTema.innerHTML = '<option value="" disabled selected>-- Elige una Misión / Tema --</option>';

            misionesDB.forEach(mision => {
                const nuevaOpcion = document.createElement('option');
                nuevaOpcion.value = mision.idMision;
                nuevaOpcion.textContent = mision.nombre;
                selectTema.appendChild(nuevaOpcion);
            });
            
            // Insertar al final la opción interactiva para añadir temas nuevos (futuro feature)
            const opcionNueva = document.createElement('option');
            opcionNueva.value = "nueva";
            opcionNueva.textContent = "➕ Añadir nuevo tema...";
            selectTema.appendChild(opcionNueva);
        } catch (error) {
            console.error('Error cargando temas:', error);
            mostrarError('Error al conectar con el servidor.');
        }
    }

    // Inicializar el cargado dinámico
    cargarTemas();

    //Funcion para mostrar mensajes de error.
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
        if (mensajeExito) mensajeExito.style.display = 'none';
    }

    function mostrarExito(mensaje) {
        if (mensajeExito) {
            mensajeExito.style.display = 'none';
        }
        contenedorError.style.display = 'none';
        mostrarModalNativo('¡Éxito!', mensaje);
    }

    //funcion para ocultar el mensaje de error
    function ocultarError() {
        contenedorError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none';
    }

    const listaEjerciciosMision = document.getElementById('lista-ejercicios-mision');
    const estadoResumen = document.getElementById('estado-resumen');

    // Lógica visual para mostrar/ocultar el input de nuevo tema y cargar resumen
    selectTema.addEventListener('change', async () => {
        if (selectTema.value === 'nueva') {
            inputNuevoTema.style.display = 'block';
            inputNuevoTema.focus();
            
            estadoResumen.style.display = 'block';
            estadoResumen.textContent = 'Misión nueva. Aún no hay ejercicios creados.';
            listaEjerciciosMision.innerHTML = '';
        } else {
            inputNuevoTema.style.display = 'none';
            inputNuevoTema.value = '';
            
            await cargarResumenEjercicios(selectTema.value);
        }
    });

    async function cargarResumenEjercicios(idMision) {
        estadoResumen.style.display = 'block';
        estadoResumen.textContent = 'Cargando ejercicios...';
        listaEjerciciosMision.innerHTML = '';

        try {
            const res = await fetch(`${API_BASE}/misiones/${idMision}/ejercicios`);
            if (!res.ok) throw new Error('Error al obtener ejercicios');
            const ejercicios = await res.json();

            if (ejercicios.length === 0) {
                estadoResumen.textContent = 'Esta misión no tiene ejercicios aún.';
            } else {
                estadoResumen.style.display = 'none';
                ejercicios.forEach((ejercicio, index) => {
                    const div = document.createElement('div');
                    div.className = 'tarjeta-ejercicio-resumen';
                    div.innerHTML = `
                        <strong>Ejercicio ${index + 1}</strong>
                        <p>${ejercicio.enunciado}</p>
                    `;
                    listaEjerciciosMision.appendChild(div);
                });
            }
        } catch (error) {
            console.error('Error al cargar resumen:', error);
            estadoResumen.textContent = 'Error al cargar el resumen de ejercicios.';
        }
    }

    // Validación y envío del formulario
    formEjercicio.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        ocultarError();

        let temaFinal = selectTema.value;
        const nombreNuevoTema = inputNuevoTema.value.trim();

        const pregunta = textPregunta.value.trim();
        const opA = inputOpA.value.trim();
        const opB = inputOpB.value.trim();
        const opC = inputOpC.value.trim();
        const opD = inputOpD.value.trim();
        const correcta = selectCorrecta.value;

        if (!temaFinal || !pregunta || !opA || !opB || !opC || !opD || !correcta) {
            mostrarError('Por favor, completa todos los campos del ejercicio y selecciona la respuesta correcta.');
            return;
        }

        if (temaFinal === 'nueva' && !nombreNuevoTema) {
            mostrarError('Por favor, ingresa el nombre del nuevo tema.');
            inputNuevoTema.focus();
            return;
        }

        const opciones = [opA, opB, opC, opD];
        const opcionesUnicas = new Set(opciones);
        
        if (opcionesUnicas.size !== opciones.length) {
            mostrarError('Hay opciones de respuesta repetidas. Cada opción debe ser diferente para no confundir al alumno.');
            return;
        }

        try {
            const btnSubmit = formEjercicio.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            btnSubmit.disabled = true;

            // 1. Si es tema nuevo, crearlo en el backend
            if (temaFinal === 'nueva') {
                btnSubmit.textContent = 'Creando misión...';
                
                const resMision = await fetch(`${API_BASE}/misiones`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre: nombreNuevoTema })
                });

                const dataMision = await resMision.json();

                if (!resMision.ok) {
                    mostrarError(`Error al crear la misión: ${dataMision.msg || dataMision.error || 'Desconocido'}`);
                    btnSubmit.textContent = originalText;
                    btnSubmit.disabled = false;
                    return;
                }

                // Asignar el nuevo ID generado por la API
                temaFinal = dataMision.mision.idMision;
            }

            // 2. Guardar el ejercicio en la misión (sea nueva o existente)
            btnSubmit.textContent = 'Guardando...';

            const res = await fetch(`${API_BASE}/misiones/${temaFinal}/ejercicios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pregunta, opA, opB, opC, opD, correcta })
            });

            const data = await res.json();
            
            btnSubmit.textContent = originalText;
            btnSubmit.disabled = false;

            if (res.ok) {
                mostrarExito('¡Ejercicio guardado exitosamente en la misión!');
                formEjercicio.reset();
                inputNuevoTema.style.display = 'none';
                await cargarTemas(); // Recargar los selectores para mostrar la nueva misión
                
                // Asegurar que la misión seleccionada sea la misma en la que se guardó
                selectTema.value = temaFinal;
                await cargarResumenEjercicios(temaFinal);
            } else {
                mostrarError(`Error al guardar: ${data.msg || 'Desconocido'}`);
            }
        } catch (error) {
            console.error('Error al enviar ejercicio:', error);
            mostrarError('Error de conexión con el servidor.');
            
            // Asegurarnos de desbloquear el boton en caso de error
            const btnSubmit = formEjercicio.querySelector('button[type="submit"]');
            if (btnSubmit) {
                btnSubmit.textContent = 'Guardar Ejercicio';
                btnSubmit.disabled = false;
            }
        }
    });

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