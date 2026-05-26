document.addEventListener('DOMContentLoaded', () => {

    // Elementos del html (variables a modificar)
    const btnEstudiante = document.getElementById('btn-estudiante');
    const btnProfesor = document.getElementById('btn-profesor');
    const loginTitulo = document.getElementById('login-titulo');
    const loginDescripcion = document.getElementById('login-descripcion');
    const formLogin = document.getElementById('form-login');
    const labelIdentificador = document.getElementById('label-identificador');
    const inputIdentificador = document.getElementById('identificador');
    const inputPassword = document.getElementById('password');
    const btnLogin = document.getElementById('btn-login');
    const footerLogin = document.getElementById('footer-login')
    const contenedorError = document.getElementById('contenedor-error');
    const textoError = document.getElementById('texto-error');

    // variable default del boton seleccionado.
    let rolActual = 'estudiante';

    // Función para mostrar el contenedor de error (Mensaje de error)
    function mostrarError(mensaje) {
        textoError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }

    // Función para ocultar el contenedor de error (Mensaje de error)
    function ocultarError() {
        contenedorError.style.display = 'none';
    }

    //Función que cambia el aspecto del login dependiendo del rol seleccionado (estudiante)
    btnEstudiante.addEventListener('click', () => {
        rolActual = 'estudiante';
        ocultarError();

        btnEstudiante.classList.add('active');
        btnProfesor.classList.remove('active');
        loginTitulo.textContent = 'Ingreso de Estudiantes';
        loginDescripcion.textContent = '¡Hola explorador! Introduce tu usuario y contraseña para continuar la aventura.';
        labelIdentificador.textContent = 'Nombre de Perfil';
        inputIdentificador.type = 'text';
        inputIdentificador.placeholder = 'Ej. ExploradorMate';
        btnLogin.textContent = '¡Comenzar Expedición!';
        
        footerLogin.style.display = 'none';
    });

    //Función que cambia el aspecto del login dependiendo del rol seleccionado (profesor)
    btnProfesor.addEventListener('click', () => {
        rolActual = 'profesor';
        ocultarError();
        
        btnProfesor.classList.add('active');
        btnEstudiante.classList.remove('active');

        loginTitulo.textContent = 'Iniciar Sesión - Profesor';
        loginDescripcion.textContent = 'Ingresa tus credenciales para acceder al panel del profesor.';
        labelIdentificador.textContent = 'Correo Electrónico';
        inputIdentificador.type = 'email';
        inputIdentificador.placeholder = 'ejemplo@correo.com';
        btnLogin.textContent = 'Ingresar al Sistema';
        
        footerLogin.style.display = 'block';
    });

    // Función para procesar el envío del formulario
    formLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();
        ocultarError();

        const identificador = inputIdentificador.value.trim();
        const password = inputPassword.value;

        //Validar que no haya campos vacíos
        if (!identificador || !password) {
            mostrarError('Por favor, rellena todos los campos.');
            return;
        }

        if (rolActual === 'estudiante') {
            // Lógica para Estudiantes
            //if ( FUNCION DE VALIDACION DE CREDENCIALES DE ESTUDIANTE DEL BACKEND ) {
            //window.location.href = 'menu-profesor.html';
            //}else{
            //mostrarError('Credenciales incorrectas. Por favor, intenta de nuevo.');
            //return;
            //}
        } else {
            // Validación específica para Profesor: formato de correo
            const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regexCorreo.test(identificador)) {
                mostrarError('Por favor, ingresa un correo electrónico válido.');
                return;
            }

            // Lógica para Profesores
            //if ( FUNCION DE VALIDACION DE CREDENCIALES DE PROFESOR DEL BACKEND ) {
            //window.location.href = 'menu-profesor.html';
            //}else{
            //mostrarError('Credenciales incorrectas. Por favor, intenta de nuevo.');
            //return;
            //}
        }
    });
});