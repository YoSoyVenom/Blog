import { fetchWithAuth, requestWithAuth } from "./base.js";

// ASIDE CODE
const aside = document.getElementById("sidebar");
const btnAsideProfile = document.getElementById("btn-profile");
const header = document.getElementById("encabezado");
const headerHeight = header.offsetHeight;

function ajustarClasePorResolucion() {
    const anchoVentana = window.innerWidth;
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
window.addEventListener("resize", ajustarClasePorResolucion);
ajustarClasePorResolucion();

// MOSTRAR INFORMACIÓN DEL USUARIO

const usernameObject = document.getElementById("sidebar__username");

async function mostrarInfoUsuario() {
    const url = "/home/me";

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok) {
            usernameObject.innerText = data.username;
        } else if (response.status === 401) {
            requestWithAuth();
        }

    }
    catch (error) {
        console.error(error);
    }
}

// LOG OUT

const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
const simboloCerrarSesion = document.getElementById("simbolo-cerrar-sesion");

btnCerrarSesion.addEventListener("click", cerrarSesion);
simboloCerrarSesion.addEventListener("click", cerrarSesion);

async function cerrarSesion() {
    try {
        const response = await fetch("/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "/login";
            return;
        }

        const data = await response.json();
        console.error(data.message);

    } catch (error) {
        console.error(error);
    }
}

const btnPublicar = document.getElementById("main__publicar");
const textoPublicacion = document.getElementById("texto_publicacion");

btnPublicar.addEventListener("click", crearPost);

async function crearPost(e) {
    e.preventDefault();

    const url = "/posts";

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
            textoPublicacion.value = "";
            await loadPosts();
            return;
        }

        const data = await response.json();
        console.error(data.message);

    } catch (error) {
        console.error(error);
    }
}

async function loadPosts() {
    const url = "/posts";
    try {
        const response = await fetch(url, {
            method: "GET"
        });

        const posts = await response.json();

        renderPosts(posts);
    } catch (error) {
        console.error(error);
    }
}

const postsFeed = document.getElementById("posts-feed");

function renderPosts(posts) {
    try {

        postsFeed.innerHTML = "";

        for (const post of posts) {

            const fecha = new Date(post.created_at);

            const fechaFormateada = fecha.toLocaleString("es-CO", {
                dateStyle: "short",
                timeStyle: "short"
            });

            const newPost = document.createElement("article");
            newPost.className = "post-card";
            newPost.dataset.postId = post.post_id

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
                        <button class="post-card__action-btn btn-action" data-action="like">
                            <span class="material-symbols-outlined">favorite_border</span>
                        </button>
                        <button class="post-card__action-btn btn-action" data-action="comments">
                            <span class="material-symbols-outlined">chat_bubble_outline</span>
                        </button>
                        <button class="post-card__action-btn btn-action" data-action="delete">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                        <button class="post-card__action-btn">
                            <span class="material-symbols-outlined">ios_share</span>
                        </button>
                    </footer>
                </div>
            `;
            postsFeed.appendChild(newPost);
        }
    } catch (error) {
        console.error(error);
    }
}

postsFeed.addEventListener("click", async (e) => {
    const btnAction = e.target.closest(".btn-action");

    if (!btnAction) return;

    const postCard = e.target.closest(".post-card");

    const postId = parseInt(postCard.dataset.postId);

    const action = btnAction.dataset.action;

    switch (action) {
        case "delete":
            await handleDelete(postId);
            await loadPosts()
            break;
        case "like":
            await handleLike(postId);
            break;
        case "comments":
            await handleComments(postId);
            break;

        default:
            console.log("Acción no reconocida");
    }
});

async function handleDelete(postId) {
    const url = "/posts";

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
            console.log("POST_DELETED");
        } else if (response.status === 401) {
            requestWithAuth();
        } else if (response.status === 404) {
            console.log("POST_NOT_FOUND");
        }
    } catch (error) {
        return console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarInfoUsuario();
    loadPosts();
});