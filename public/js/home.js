// FUNCIONES BASE.
import { fetchWithAuth, requestWithAuth } from "./base.js";

// VARIABLES

// Variables para el aside.
const aside = document.getElementById("sidebar");
const btnAsideProfile = document.getElementById("btn-profile");
const header = document.getElementById("encabezado");
const headerHeight = header.offsetHeight;

// Elemento html que contiene el nombre de usuario.
const usernameObject = document.getElementById("sidebar__username");

// Elemento html para cerrar sesión en resoluciones grandes.
const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
// Elemento html para cerrar sesión en resoluciones pequeñas.
const simboloCerrarSesion = document.getElementById("simbolo-cerrar-sesion");

// Elemento html que guarda el contenido de la publicación.
const textoPublicacion = document.getElementById("texto_publicacion");
// Elemento html para hacer publicaciones.
const btnPublicar = document.getElementById("main__publicar");
// Elemento html que borra el contenido del textarea.
const btnCancelar = document.getElementById("main__cancelar");

// Elemento html que contiene los posts.
const postsFeed = document.getElementById("posts-feed");

// Función que ajusta el estilo de acuerdo a la resolución.
function adjustClassByResolution() {
    // Obtiene el ancho de la pantalla del dispositivo usado.
    const anchoVentana = window.innerWidth;
    // Ajusta estilos si el ancho de la pantalla es menor a 768px
    if (anchoVentana < 768) {
        aside.style.top = `${headerHeight}px`;
        aside.style.height = `calc(100dvh - ${headerHeight}px)`;
        btnAsideProfile.style.display = "block";
        btnAsideProfile.addEventListener("click", () => {
            aside.classList.toggle("aside-visible");
        })
    } else {
        aside.style.top = `calc(${headerHeight}px + 20px)`;
        aside.classList.remove("aside-visible");
        btnAsideProfile.style.display = "none";
    }
}

// Ejecución del código
window.addEventListener("resize", adjustClassByResolution);
adjustClassByResolution();

// Mostrar información del usuario.

async function displayUserInfo() {
    const url = "/home/me";

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok) {
            // Muestra el nombre de usuario en el html.
            usernameObject.innerText = data.username;
        } else if (response.status === 401) {
            // Función que válida que el usuario tenga sesión.
            requestWithAuth();
        }

    }
    catch (error) {
        console.error(error);
    }
}

// Eventos para cerrar sesión.
btnCerrarSesion.addEventListener("click", logOut);
simboloCerrarSesion.addEventListener("click", logOut);

// Función que hace la petición para cerrar sesión.
async function logOut() {
    const url = "/logout";

    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            // Redirige a html si la sesión se cierra correctamente.
            window.location.href = "/login";
            return;
        }

        const data = await response.json();
        console.error(data.message);

    } catch (error) {
        console.error(error);
    }
}

// Evento para crear una publicación.
btnPublicar.addEventListener("click", createPost);

// Función para crear una publicación.
async function createPost(e) {
    // Previene que se recargue la página.
    e.preventDefault();
    const url = "/posts";
    // Datos que necesita el BackEnd para crear la publicación.
    const credenciales = {
        content: textoPublicacion.value
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(credenciales)
        });

        if (response.ok) {
            // Borra el contenido del elemento html que tiene el contenido del post.
            textoPublicacion.value = "";
            // Llamado a la función que carga los posts.
            await loadPosts();
            return;
        }

        const data = await response.json();
        console.error(data.message);

    } catch (error) {
        console.error(error);
    }
}

// Función que carga los posts.
async function loadPosts() {
    const url = "/posts";

    try {
        const response = await fetch(url, {
            method: "GET"
        });

        const posts = await response.json();

        // Llamado a la función que renderiza los datos.
        renderPosts(posts);

    } catch (error) {
        console.error(error);
    }
}

// Función que renderiza los posts.
function renderPosts(posts) {
    try {

        // Borra el contenido del contenedor de posts.
        postsFeed.innerHTML = "";

        // Bucle que itera los datos y renderiza los datos en html.
        for (const post of posts) {

            // Objeto que almacena la fecha.
            const fecha = new Date(post.created_at);
            // Formato más sencillo a la fecha.
            const fechaFormateada = fecha.toLocaleString("es-CO", {
                dateStyle: "short",
                timeStyle: "short"
            });

            // Elemento html que contiene la información y sus propiedades.
            const newPost = document.createElement("article");
            newPost.className = "post-card";
            // Guarda el identificador del post en una propiedad del elemento html.
            newPost.dataset.postId = post.post_id
            // Le agrega datos al elemento html con el boton delete.
            newPost.innerHTML = `
                <div class="post-card__photo-wrapper">
                    <span class="material-symbols-outlined post-card__photo" aria-label="Foto de usuario">account_circle</span>
                </div>

                <div class="post-card__content">
                    <div class="post-card__info">
                        <h2 class="post-card__name">${post.username}</h2>

                        <time class="post-card__date" datetime="${post.created_at}">${fechaFormateada}</time>

                    </div>

                    <p class="post-card__message">${post.content_text}</p>

                    <footer class="post-card__footer-actions">
                        <button class="post-card__action-btn btn-action" id="btn-action__like" data-action="like">
                            <!-- Validación para agregar la clase para dar un color específico al botón -->
                            <span class="material-symbols-outlined like__symbol ${post.is_liked ? "like__symbol-active" : ""}">favorite</span>
                            <!-- Número de likes -->
                            <p class="post-card__like">${post.total_likes}</p>
                        </button>
                        <button class="post-card__action-btn btn-action" data-action="comments">
                            <span class="material-symbols-outlined">chat_bubble_outline</span>
                        </button>
                        <!-- Validación para agregar el boton delete -->
                        ${post.can_delete ? `
                            <button class="post-card__action-btn btn-action" data-action="delete">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        ` : ""
                        }
                        <button class="post-card__action-btn">
                            <span class="material-symbols-outlined">ios_share</span>
                        </button>
                    </footer>
                </div>
            `;
            // Agrega el elemento html al contenedor de posts.
            postsFeed.appendChild(newPost);
        }
    } catch (error) {
        console.error(error);
    }
}

// Elemento para limpiar la publicación.
btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    // Vacia el contenido de la publicación.
    textoPublicacion.value = "";
});

// Captura cualquier evento click sobre un boton con la clase btn-action.
postsFeed.addEventListener("click", async (e) => {
    // Obtiene el elemento btn-action.
    const btnAction = e.target.closest(".btn-action");
    // Válida que se haya dado click sobre un btn-action.
    if (!btnAction) return;
    // Obtiene el post sobre el que se hizo click.
    const postCard = e.target.closest(".post-card");
    // Obtiene el identificador del post.
    const postId = parseInt(postCard.dataset.postId);
    // Obtiene el nombre de la acción.
    const action = btnAction.dataset.action;
    // Condicional para válidar el tipo de acción.
    switch (action) {
        case "delete":
            // Llamado a función que maneja como se elimina un post.
            await handleDelete(postId);
            // Llamado a la función que carga los posts.
            await loadPosts();
            break;
        case "like":
            // Llamado a función que maneja un like dado a un post.
            await handleLike(postId);
            // Llamado a la función que carga los posts.
            await loadPosts();
            break;
        case "comments":
            // Llamado a función que muestra los comentarios.
            await handleComments(postId);
            break;

        default:
            console.log("Acción no reconocida");
    }
});

// Función que hace la petición para eliminar un post.
async function handleDelete(postId) {
    const url = "/posts";
    // Información necesaria para hacer la petición.
    const credenciales = {
        post_id: postId
    }

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(credenciales)
        });

        if (response.ok) {
            // Mensaje si la petición es exitosa.
            console.log("POST_DELETED");
        } else if (response.status === 401) {
            // Llamado a función base que válida la sesión del usuario.
            requestWithAuth();
        } else if (response.status === 404) {
            // Mensaje si el post no se encontró.
            console.log("POST_NOT_FOUND");
        }
    } catch (error) {
        return console.error(error);
    }
}

// Función que hace la petición de dar like o quitar el like.
async function handleLike(postId) {
    const url = `/posts/${postId}/like`;
    // Información necesaria para hacer la petición.
    const credenciales = {
        post_id: postId
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data = await response.json();

        if (response.status === 401) {
            // Llamado a función base que válida la sesión del usuario.
            await requestWithAuth();
            // Llamar nuevamente la función si se puedo autenticar.
            handleLike(postId);
        } else if (response.status == 404) {
            console.log(data.message);
        }

    } catch (error) {
        console.error(error);
    }
}

// Función para garantizar el orden en el arranque.
async function initializeHome() {
    await displayUserInfo();
    await loadPosts();
}

// Funciones que se cargan después de que el html está cargado.
document.addEventListener("DOMContentLoaded", initializeHome);
