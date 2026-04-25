const API = "/api";
        let usuario = null;
        let juegos = [];
        let isRegister = false;

        // DATOS
        let catalogos = { generos: [], formatos: [], estados: [], plataformas: [] };

        // AUTH
        /**
         * Función para alternar entre los modos de autenticación (login y registro).
         * Cambia el estado de `isRegister`, muestra u oculta el campo de nombre, y actualiza los textos de los botones y títulos según el modo actual.
         */
        function toggleAuth() {
            isRegister = !isRegister;
            document.getElementById('auth-name').style.display = isRegister ? 'block' : 'none';
            document.getElementById('auth-title').innerText = isRegister ? 'Crear cuenta' : 'Iniciar sesión';
            document.getElementById('btn-auth').innerText = isRegister ? 'REGISTRARSE' : 'ENTRAR';
            document.getElementById('toggle-auth').innerText = isRegister ? '¿Ya tienes cuenta? Entra' : '¿No tienes cuenta? Regístrate';
        }

        /**
         * Función para manejar tanto el login como el registro de usuarios.
         * Dependiendo del estado de `isRegister`, se enviará la solicitud al endpoint correspondiente.
         * En caso de éxito, se almacenará el usuario y token en localStorage y se iniciará la aplicación.
         * Si ocurre algún error, se mostrará un mensaje adecuado al usuario.
         */
        async function login() {
            const email = document.getElementById('auth-email').value;
            const pass = document.getElementById('auth-pass').value;
            const name = document.getElementById('auth-name').value;
            const error = document.getElementById('auth-error');

            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const body = isRegister ? {email, password: pass, nombre: name} : {email, password: pass};

            try {
                const res = await fetch(API + endpoint, {
                    method: 'POST', headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                });
                if (res.ok) {
                    const user = await res.json();
                    if(user) {
                        usuario = user;
                        localStorage.setItem('user_gm', JSON.stringify(user));
                        localStorage.setItem('token_gm', user.token);
                        iniciarApp();
                    } else { error.innerText = "Credenciales incorrectas"; }
                } else { error.innerText = "Error en el servidor"; }
            } catch(e) { error.innerText = "Error de conexión"; }
        }

        /**
         * Función para iniciar la aplicación después de un login o registro exitoso.
         * Oculta la pantalla de autenticación, muestra la pantalla principal, actualiza el saludo con el nombre del usuario y carga los catálogos necesarios para la aplicación.
         */
        function iniciarApp() {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('app-screen').style.display = 'block';
            document.getElementById('user-name-display').innerText = "Hola, " + usuario.nombre;
            cargarCatalogos();
        }

        /**
         * Función para cargar los catálogos de géneros, formatos, estados y plataformas desde el servidor.
         * Envía una solicitud GET al endpoint de catálogos con el token de autenticación.
         * Al recibir la respuesta, almacena los catálogos en la variable `catalogos`, llena los selects correspondientes y carga los juegos del usuario.
         */
        async function cargarCatalogos() {
            const token = localStorage.getItem('token_gm');
            const res = await fetch(`${API}/catalogos`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            catalogos = await res.json();
            cargarSelects();
            cargarJuegos();
        }

        /**
         * Función para cerrar la sesión del usuario.
         * Elimina los datos del usuario y el token del localStorage, y recarga la página para mostrar la pantalla de autenticación.
         */
        function logout() {
            localStorage.removeItem('user_gm');
            localStorage.removeItem('token_gm');
            location.reload();
        }

        /**
         * Al cargar la página, se verifica si hay un usuario guardado en localStorage.
         * Si existe, se parsea el usuario y se inicia la aplicación automáticamente, manteniendo la sesión activa.
         */
        window.onload = () => {
            const saved = localStorage.getItem('user_gm');
            if(saved) { usuario = JSON.parse(saved); iniciarApp(); }
        };

        // JUEGOS
        /**
         * Función para cargar los juegos del usuario desde el servidor.
         * Envía una solicitud GET al endpoint de videojuegos con el ID del usuario y el token de autenticación.
         * Si la respuesta es exitosa, se almacenan los juegos en la variable `juegos` y se renderizan en la interfaz.
         * Si el servidor responde con un estado 403, se asume que el token ha caducado o es inválido, se muestra un mensaje de alerta y se cierra la sesión.
         */
        async function cargarJuegos() {
            const token = localStorage.getItem('token_gm');

            const res = await fetch(`${API}/videojuegos?usuarioId=${usuario.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (res.status === 403) {
                alert("Tu sesión ha caducado por seguridad. Vuelve a iniciar sesión.");
                logout();
                return;
            }

            juegos = await res.json();
            render(juegos);
        }

        /**
         * Función para renderizar la lista de juegos en la interfaz.
         * Toma una lista de juegos como argumento y genera el HTML correspondiente para cada juego, mostrando su información y acciones disponibles.
         * Si la lista está vacía, muestra un mensaje indicando que no hay juegos.
         */
        function render(lista) {
            const grid = document.getElementById('games-grid');
            grid.innerHTML = "";
            if(lista.length === 0) { grid.innerHTML = "<p style='color:#666; text-align:center; grid-column:1/-1;'>No tienes juegos aún.</p>"; return; }

            lista.forEach(j => {
                const img = j.caratula ? `<img src="${j.caratula}" onerror="this.src='media/logo.png'">` : `<div class="no-image">Sin imagen</div>`;
                const jStr = JSON.stringify(j).replace(/"/g, '&quot;');
                let estadoNombre = j.estado ? j.estado.nombre : 'Desconocido';
                let clase = estadoNombre === 'Completado' ? 'tag-completed' : (estadoNombre === 'Jugando' ? 'tag-playing' : 'tag-pending');
                let estrellasHTML = j.puntuacion ? `<div style="color: gold; margin-bottom: 5px;">${'⭐'.repeat(j.puntuacion)}</div>` : '';

                grid.innerHTML += `
                <div class="game-card">
                    <div class="card-image">${img}</div>
                    <div class="card-content">
                        <div class="card-title">${j.titulo}</div>
                        ${estrellasHTML}
                        <div class="card-meta">${j.plataforma ? j.plataforma.nombre : 'Plat'} • ${j.anio || '?'}</div>
                        <div class="tags-container">
                            <span class="tag">${j.genero ? j.genero.nombre : 'Gen'}</span>
                            <span class="tag ${clase}">${estadoNombre}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn-icon btn-edit-orange" alt="Editar" onclick="editar(${jStr})">✏️</button>
                        <button class="btn-icon btn-delete-orange" alt="Eliminar" onclick="preBorrar(${j.id})">🗑️</button>
                    </div>
                </div>`;
            });
        }

        /**
         * Función para guardar un juego, ya sea creando uno nuevo o actualizando uno existente.
         * Si el campo de carátula está vacío, se asigna una imagen por defecto. Si se proporciona una URL de carátula, se valida que sea un enlace web que termine en un formato de imagen válido.
         * Recopila los datos del formulario, determina si se trata de una creación o actualización según la presencia de un ID,
         * y envía la solicitud correspondiente al servidor con el token de autenticación.
         * Después de guardar, cierra el modal y recarga la lista de juegos.
         */
        async function guardarJuego() {
            const id = document.getElementById('id-juego').value;

            let urlCaratula = document.getElementById('caratula').value.trim();
            if (urlCaratula === "") {
                urlCaratula = "media/logo.webp";
            }else{
                const regexImagen = /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp|avif)(\?.*)?$/i;

                if (!regexImagen.test(urlCaratula)) {
                    alert("Error: La carátula debe ser un enlace web que termine en un formato de imagen válido (.jpg, .png, .webp, etc.). Si no tienes uno, deja el campo en blanco.");
                    return;
                }
            }

            const data = {
                titulo: document.getElementById('titulo').value,
                anio: document.getElementById('anio').value,
                estado: { id: document.getElementById('estado').value },
                genero: { id: document.getElementById('genero').value },
                formato: { id: document.getElementById('formato').value },
                plataforma: { id: document.getElementById('plataforma').value },
                puntuacion: document.getElementById('puntuacion').value ? parseInt(document.getElementById('puntuacion').value) : null,
                caratula: urlCaratula,
                descripcion: document.getElementById('descripcion').value
            };
            const url = id ? `${API}/videojuegos/${id}` : `${API}/videojuegos?usuarioId=${usuario.id}`;
            const method = id ? 'PUT' : 'POST';
            const token = localStorage.getItem('token_gm');

            await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(data)
            });

            cerrarModal('modal-form');
            cargarJuegos();
        }

        /**
         * Función para preparar el borrado de un juego.
         * Toma el ID del juego a borrar, lo almacena en un campo oculto y muestra el modal de confirmación de borrado.
         */
        function preBorrar(id) {
            document.getElementById('id-borrar').value=id;
            document.getElementById('modal-delete').style.display='flex';
        }

        /**
         * Función para confirmar el borrado de un juego.
         * Toma el ID del juego a borrar desde el campo oculto, envía una solicitud DELETE al servidor con el token de autenticación,
         * cierra el modal de confirmación y recarga la lista de juegos.
         */
        async function confirmarBorrado() {
            const token = localStorage.getItem('token_gm');

            await fetch(`${API}/videojuegos/${document.getElementById('id-borrar').value}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            cerrarModal('modal-delete');
            cargarJuegos();
        }

        // UTILS
        /**
         * Función para llenar los selects de género, estado, plataforma y formato con los datos obtenidos de los catálogos.
         * Toma el ID del select, el ID del filtro (si aplica) y la lista de opciones para llenar cada select correspondiente.
         * Si se proporciona un ID de filtro, también se llena ese select con las mismas opciones, añadiendo una opción "Todos" al inicio.
         */
        function cargarSelects() {
            const llenar = (idSel, idFil, lista) => {
                const sel = document.getElementById(idSel);
                if (sel) sel.innerHTML = "";

                const fil = document.getElementById(idFil);
                if (fil) fil.innerHTML = '<option value="">Todos</option>';

                if (!lista) return;

                lista.forEach(item => {
                    if (sel) sel.add(new Option(item.nombre, item.id));
                    if (fil) fil.add(new Option(item.nombre, item.id));
                });
            };

            llenar('genero', 'filtro-gen', catalogos.generos);
            llenar('estado', 'filtro-est', catalogos.estados);
            llenar('plataforma', 'filtro-plat', catalogos.plataformas);
            llenar('formato', null, catalogos.formatos);
        }

        /**
         * Función para editar un juego.
         * Toma un objeto de juego como argumento, llena el formulario con los datos del juego y muestra el modal de edición.
         * Si el juego no tiene ciertos campos (como género, estado, formato o plataforma), se manejan adecuadamente para evitar errores.
         */
        function editar(j) {
            document.getElementById('id-juego').value=j.id;
            document.getElementById('titulo').value=j.titulo;
            document.getElementById('anio').value=j.anio;
            document.getElementById('genero').value=j.genero ? j.genero.id : '';
            document.getElementById('estado').value=j.estado ? j.estado.id : '';
            document.getElementById('formato').value=j.formato ? j.formato.id : '';
            document.getElementById('plataforma').value=j.plataforma ? j.plataforma.id : '';
            document.getElementById('puntuacion').value = j.puntuacion || '';
            document.getElementById('caratula').value=j.caratula || '';
            document.getElementById('descripcion').value=j.descripcion || '';
            document.getElementById('modal-form').style.display='flex';
        }

        /**
         * Función para aplicar los filtros de búsqueda a la lista de juegos.
         * Toma los valores de los campos de filtro (texto, género, plataforma y estado) y filtra la lista de juegos en función de esos criterios.
         * Luego, renderiza la lista filtrada en la interfaz. Si un campo de filtro está vacío, se ignora ese criterio en el filtrado.
         */
        function aplicarFiltros() {
            const txt = document.getElementById('filtro-txt').value.toLowerCase();
            const g = document.getElementById('filtro-gen').value;
            const p = document.getElementById('filtro-plat').value;
            const e = document.getElementById('filtro-est').value;

            render(juegos.filter(j => {
                const matchTxt = j.titulo.toLowerCase().includes(txt);
                const matchGen = g === "" || (j.genero && j.genero.id == g);
                const matchPlat = p === "" || (j.plataforma && j.plataforma.id == p);
                const matchEst = e === "" || (j.estado && j.estado.id == e);

                return matchTxt && matchGen && matchPlat && matchEst;
            }));
        }

        /**
         * Función para cerrar un modal.
         * Toma el ID del modal a cerrar como argumento y establece su estilo de visualización a 'none' para ocultarlo.
         */
        function cerrarModal(id){ document.getElementById(id).style.display='none'; }

        /**
         * Función para abrir el modal de edición de juegos. 
         * Deja los campos en blanco para crear un nuevo juego, o los llena con los datos del juego a editar si se llama desde la función `editar()`. Luego muestra el modal para que el usuario pueda ingresar o modificar la información del juego.
         */
        function abrirModal(){
            document.getElementById('id-juego').value = "";

            document.getElementById('titulo').value = "";
            document.getElementById('anio').value = "";
            document.getElementById('caratula').value = "";
            document.getElementById('descripcion').value = "";


            document.getElementById('puntuacion').value = "";
            document.getElementById('estado').selectedIndex = 0;
            document.getElementById('genero').selectedIndex = 0;
            document.getElementById('formato').selectedIndex = 0;
            document.getElementById('plataforma').selectedIndex = 0;

            document.getElementById('modal-form').style.display = 'flex';
        }

        /**
         * Función para abrir el modal de filtros.
         * Limpia los campos de filtro para mostrar todos los juegos, aplica los filtros (que en este caso no filtrarán nada porque están vacíos) y luego muestra el modal de filtros para que el usuario pueda seleccionar nuevos criterios de filtrado.
         */
        function abrirFiltros() {
            document.getElementById('filtro-txt').value = "";

            document.getElementById('filtro-gen').value = "";
            document.getElementById('filtro-plat').value = "";
            document.getElementById('filtro-est').value = "";

            aplicarFiltros();

            document.getElementById('modal-filtros').style.display = 'flex';
        }

        /**
         * Función para solicitar la recuperación de contraseña.
         * Pide al usuario que ingrese su correo electrónico asociado a la cuenta, y si se proporciona un correo, envía una solicitud POST al endpoint de recuperación de contraseña del servidor.
         * Si la solicitud es exitosa, se muestra un mensaje indicando que se ha enviado un enlace de recuperación. Si ocurre algún error, se muestra un mensaje adecuado al usuario.
         */
        async function solicitarRecuperacion() {
            const email = prompt("Introduce el correo electrónico de tu cuenta:");
            if (!email) return;

            try {
                const res = await fetch(API + '/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });

                if (res.ok) {
                    alert("Si el correo está registrado, recibirás un enlace de recuperación en unos minutos.");
                } else {
                    alert("Hubo un error al procesar la solicitud.");
                }
            } catch(e) {
                alert("Error de conexión con el servidor.");
            }
        }

        /**
         * Función que se ejecuta cuando se carga la página.
         * Verifica si hay un token de recuperación de contraseña en la URL. Si existe, solicita al usuario que ingrese una nueva contraseña y envía una solicitud POST al servidor para restablecer la contraseña utilizando el token.
         * Si el restablecimiento es exitoso, se muestra un mensaje de éxito y se redirige al usuario a la página de inicio. Si el token es inválido o ha caducado, se muestra un mensaje de error. Si no hay un token de recuperación, se verifica si hay un usuario guardado en localStorage para iniciar la sesión automáticamente.
         */
        window.onload = async () => {
            const params = new URLSearchParams(window.location.search);
            const resetToken = params.get('resetToken');

            if (resetToken) {
                const nuevaPassword = prompt("RECUPERACIÓN: Introduce tu nueva contraseña:");
                if (nuevaPassword) {
                    try {
                        const res = await fetch(API + '/auth/reset-password', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + resetToken
                            },
                            body: JSON.stringify({ password: nuevaPassword })
                        });

                        if (res.ok) {
                            alert("¡Contraseña cambiada con éxito! Ya puedes iniciar sesión.");
                            window.location.href = "/";
                        } else {
                            alert("El enlace ha caducado o es inválido. Vuelve a solicitar la recuperación.");
                        }
                    } catch(e) {
                        alert("Error de conexión.");
                    }
                }
                return;
            }

            const saved = localStorage.getItem('user_gm');
            if(saved) {
                usuario = JSON.parse(saved);
                iniciarApp();
            }
        };