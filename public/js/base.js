// Variables para menu desplegable.
const menuToggle = document.querySelector('.encabezado__desplegar');
const menuList = document.querySelector('.encabezado__navegacion');

// Válida que el elemento html menuToggle exista.
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('encabezado__lista--visible');
    });
}

// Función intermedia a la validación de sesión.
export async function requestWithAuth() {
    // Llamado a la función de validación de sesión.
    const refreshed = await fetchWithAuth();
    // Válida la respuesta a la función.
    if (refreshed) {
        // Devuelve que la función se cumplió con éxito.
        return true;
    }
    // Redirige a iniciar sesión si no hay sesión.
    window.location.href = "/login";
}

// Función de validación de sesión.
export async function fetchWithAuth() {
    const response = await fetch("/refresh", {
        method: "POST",
        credentials: "include"
    });

    return response.ok;
}

// Función que copia datos en el portapapeles.
export async function copyToClipboard(shareData) {
    try {
        // Se copia en el portapapeles del dispositivo.
        await navigator.clipboard.writeText(shareData);
        console.log('Texto guardado en el portapapeles');
    } catch (err) {
        console.error('Error al copiar:', err);
    }
}

export function renderComment(container, comment) {
    // Objeto que almacena la fecha.
    const fecha = new Date(comment.created_at);
    // Formato más sencillo a la fecha.
    const fechaFormateada = fecha.toLocaleString("es-CO", {
        dateStyle: "short",
        timeStyle: "short"
    });
    // Elemento html que contiene la información y sus propiedades.
    const newThread = document.createElement("div");
    newThread.className = "comment__thread";
    // Le agrega datos al elemento html.
    newThread.innerHTML = `
        <article class="comment__card" data-comment-id="${comment.comment_id}">
            <div class="comment-card__photo-wrapper">
                <span class="material-symbols-outlined comment-card__photo" aria-label="Foto de usuario">account_circle</span>
            </div>

            <div class="comment-card__content">
                <div class="comment-card__info">
                    <h2 class="comment-card__name">${comment.username}</h2>

                    <time class="comment-card__date" datetime="${comment.created_at}">${fechaFormateada}</time>

                </div>

                <p class="comment-card__message">${comment.content}</p>

                <footer class="comment-card__footer-actions">
                    <button class="comment-card__action-btn btn-action" data-action="reply">Responder</button>
                    <button class="comment-card__action-btn btn-action" id="btn-action__like" data-action="like">
                        <!-- Validación para agregar la clase para dar un color específico al botón -->
                        <span class="material-symbols-outlined like__symbol ${comment.is_liked ? "like__symbol-active" : ""}">favorite</span>
                        <!-- Número de likes -->
                        <p class="comment-card__like">${comment.total_likes}</p>
                    </button>
                    <!-- Validación para agregar el boton delete -->
                    ${comment.can_delete ? `
                        <button class="post-card__action-btn btn-action" data-action="delete">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    ` : ""
                    }
                </footer>
                <button class="comment-card__action-btn btn-action" data-action="answers">Ver respuestas</button>
            </div>
        </article>

        <div class="comment-thread__answers"></div>
    `;
    // Agrega el elemento html al contenedor de posts.
    container.appendChild(newThread);
}