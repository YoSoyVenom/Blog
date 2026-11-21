import { requestWithAuth, copyToClipboard } from "./base.js";

// Función que renderiza un post.
export function renderPost(container, post) {
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
    // Le agrega datos al elemento html.
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
                <button class="post-card__action-btn btn-action" data-action="share">
                    <span class="material-symbols-outlined">ios_share</span>
                </button>
            </footer>
        </div>
    `;
    // Agrega el elemento html al contenedor de posts.
    container.appendChild(newPost);
}

// Función que renderiza los posts.
export function renderPosts(postsFeed, posts) {
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

// Función que renderiza un único comentario.
export function renderSinglePost(container, post) {
    // Limpia el contenedor.
    container.innerHTML = "";
    // Renderiza el post.
    renderPost(container, post);
}


// FUNCIONALIDAD DE LOS POSTS.
//

// Función que hace la petición para eliminar un post.
export async function handleDelete(postId) {
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
export async function handleLike(postId) {
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
export async function handleShare(postId) {
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
