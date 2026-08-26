// FUNCIONES BASE.
import { fetchWithAuth, requestWithAuth, renderPost, renderComment, renderSinglePost } from "./base.js";

// VARIABLES

// Variable global.
let currentPostId = null;

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

// Elemento html de la ventana modal.
const modalComments = document.getElementById("main__modal");
// Elemento html que guarda el post en la ventana modal.
const postContainer = document.getElementById("post__container");
// Elemento html que contiene los comentarios.
const commentsFeed = document.getElementById("comments__feed");
// Elemento html que cierra la ventana modal.
const btnCloseModal = document.getElementById("btn-close");

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

export async function displayUserInfo() {
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
            await requestWithAuth();
            // Recursión de displayUserInfo.
            displayUserInfo();
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
            // LLamado a la función que renderiza el post. 
            renderPost(postsFeed, post)
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
        case "share":
            // Llamado a función que comparte la publicación.
            await handleShare(postId);
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
            return handleLike(postId);
        } else if (response.status == 404) {
            console.log(data.message);
        }

    } catch (error) {
        console.error(error);
    }
}

// Función que ejecuta la acción de compartir el post.
async function handleShare(postId) {
    // URL con postId como parámetro de consulta.
    const url = `/posts/${postId}/share`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data = await response.json();
        // Data de la publicación.
        const shareData = {
            text: `¡Mira esta publicación!: "${data.content_text}"`,
            url: window.location.href
        }
        // Validación de navigator.share dentro del dispositivo.
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log("Post compartido con éxito");
            } catch (err) {
                console.log("El usuario canceló la acción");
            }
        } else {
            // Llamado a función que copia la data en el postapapeles.
            await copyToClipboard(shareData);
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Función que copia datos en el portapapeles.
async function copyToClipboard(shareData) {
    try {
        // Se copia en el portapapeles del dispositivo.
        await navigator.clipboard.writeText(shareData);
        console.log('Texto guardado en el portapapeles');
    } catch (err) {
        console.error('Error al copiar:', err);
    }
}

// Función que maneja los comentarios.
async function handleComments(postId) {
    // Actualización a currentPostId.
    currentPostId = postId;
    // LLamado a funciones para obtener los datos.
    const [post, comments] = await Promise.all([
        // Llamado a función que carga el post.
        loadPost(postId),
        // Llamado a función que carga los comentarios.
        loadComments(postId)
    ]);
    // Llamado a la función que renderiza el post.
    renderSinglePost(postContainer, post);
    // Llamado a la función que renderiza los comentarios.
    renderComments(comments);
    // LLamado a la función que abre la ventana modal.
    openModalComments();
}

// Función que obtiene el post.
async function loadPost(postId) {
    // URL para hacer la petición con el parámetro de consulta postId.
    const url = `/posts/${postId}`;

    try {
        const response = await fetch(url, {
            method: "GET"
        });

        const post = await response.json();

        if (response.ok) {
            // Retorna el post obtenido.
            return post;
        } else if (response.status === 401) {
            // Llamado a función base que válida la sesión del usuario.
            await requestWithAuth();
            // Nuevo llamado a la función si se pudo autenticar.
            return loadPost(postId);
        }
    } catch (error) {
        console.error(error);
    }

}

// Función que carga los comentarios.
async function loadComments(postId) {
    // URL para hacer la petición con el parámetro de consulta postId.
    const url = `/comments/${postId}`;

    try {
        const response = await fetch(url, {
            method: "GET"
        });

        const comments = await response.json();

        if (response.ok) {
            // Retorna un objeto con los comentarios.
            return comments;
        } else if (response.status === 401) {
            // Llamado a función base que válida la sesión del usuario.
            await requestWithAuth();
            // Nuevo llamado a la función si se pudo autenticar.
            return loadComments(postId);
        }
    } catch (error) {
        console.error(error);
    }
}

// Función que renderiza los comentarios.
function renderComments(comments) {
    try {

        // Borra el contenido del contenedor de posts.
        commentsFeed.innerHTML = "";

        // Bucle que itera los datos y renderiza los datos en html.
        for (const comment of comments) {
            // LLamado a la función que renderiza el post. 
            renderComment(commentsFeed, comment);
        }
    } catch (error) {
        console.error(error);
    }
}

// Función que abre la ventana modal.
function openModalComments() {
    // Agrega la clase que coloca display: flex;
    modalComments.classList.remove("main__modal-close");
}

// Función que cierra la ventana modal.
btnCloseModal.addEventListener("click", () => {
    // Agrega la clase que coloca display: flex;
    modalComments.classList.add("main__modal-close");
});

// Captura cualquier evento click sobre un boton con la clase btn-action.
commentsFeed.addEventListener("click", async (e) => {
    // Obtiene el botón sobre el que se hizo click.
    const btnAction = e.target.closest(".btn-action");

    // Valida que se haya hecho click sobre un botón de acción.
    if (!btnAction) return;

    // Obtiene la tarjeta del comentario.
    const commentCard = e.target.closest(".comment__card");

    // Valida que exista la tarjeta del comentario.
    if (!commentCard) return;

    // Obtiene el identificador del comentario.
    const commentId = Number(commentCard.dataset.commentId);

    // Obtiene el tipo de acción.
    const action = btnAction.dataset.action;

    // Ejecuta la acción correspondiente.
    switch (action) {
        case "reply":
            await handleCommentAnswer(commentId);
            break;

        case "like":
            // Llamado a la función que maneja dar like.
            await handleCommentLike(commentId);
            // Llamado a la función que refresca los comentarios en la ventana modal.
            await refreshComments();
            break;

        case "delete":
            await handleCommentDelete(commentId);
            break;

        case "answers":
            await handleCommentAnswers(commentId);
            break;

        default:
            console.log("Acción no reconocida");
    }
});
// Función que maneja un like dado a un comentario.
async function handleCommentLike(commentId) {
    const url = `/comments/${commentId}/like`;

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
            return handleCommentLike(commentId);
        } else if (response.status == 404) {
            console.log(data.message);
        }
    } catch (error) {
        console.log(data.message);
    }
}

// Función que refresca los comentarios después de alguna acción.
async function refreshComments() {
    // Llamado a función que obtiene los comentarios.
    const comments = await loadComments(currentPostId);
    // Llamado a función que renderiza los comentarios.
    renderComments(comments);
}

// Funciones que se cargan después de que el html está cargado.
document.addEventListener("DOMContentLoaded", initHome);

// Función que inicializa la página.
async function initHome() {
    // Llamado a función que carga los datos de usuario.
    await displayUserInfo();
    // Llamado a función que carga los posts.
    await loadPosts();
}


// NOTA: PUEDO HACER UNA FUNCIÓN MÁS ADELANTE LLAMADA ensureAuthenticated QUE ASEGURE LA SESIÓN.