// home.js

// === LÓGICA DE RESPONSIVIDAD Y ASIDE (Tu Código) ===
const aside = document.getElementById("sidebar");
const btnAsideProfile = document.getElementById("btn-profile");
const header = document.getElementById("encabezado");
const headerHeight = header.offsetHeight;

function ajustarClasePorResolucion() {
    // ... (Tu lógica de ajuste de aside) ...
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


// === LÓGICA DE MODAL Y POSTS ===

// Elemento donde inyectaremos los posts
const postsContainer = document.querySelector(".main__feed"); // Usamos tu selector CSS

// Dialog y Form (Tu Código)
const modal = document.getElementById("modal-publicacion");
const textarea = document.getElementById("post-content");
const dateInput = document.getElementById("modal-fecha"); // 🔑 Nueva referencia al input de fecha
const btnAbrir = document.getElementById("btn-abrir");
const btnCerrar = document.getElementById("btn-cerrar");
const postForm = modal.querySelector(".modal__formulario");
const btnPublicar = modal.querySelector(".modal__btn-publicar");


// Lógica del Modal (Tu Código)
btnAbrir.addEventListener("click", () => {
    modal.showModal();
    textarea.focus();
    modal.classList.add("modal-visible");
});

btnCerrar.addEventListener("click", () => {
    modal.close();
    modal.classList.remove("modal-visible");
    postForm.reset(); 
    btnPublicar.disabled = true; // Deshabilitar después de resetear
});

textarea.addEventListener('input', () => {
    btnPublicar.disabled = textarea.value.trim() === '';
});


// 🔑 FUNCIÓN PARA ENVIAR PUBLICACIÓN (CORREGIDA)
postForm.addEventListener('submit', enviarPublicacion);

async function enviarPublicacion(e) {
    e.preventDefault(); 
    btnPublicar.disabled = true; // Deshabilitar temporalmente

    const content = textarea.value.trim();
    // 💡 Capturamos el valor de la fecha, si existe
    const date = dateInput.value; 
    
    if (!content) return;

    const URL_POST = "http://localhost:3200/api/posts/create"; 

    try {
        const response = await fetch(URL_POST, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // El backend puede generar un título si no hay uno,
                // por simplicidad enviamos 'content' y 'date'
                content: content,
                date: date, // 🔑 Enviamos la fecha al controlador
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message + " Autor: " + data.post.username);
            
            modal.close();
            modal.classList.remove("modal-visible");
            postForm.reset(); 
            // 💡 CLAVE: Recargar el feed inmediatamente después de crear un post
            await fetchAndRenderPosts(postsContainer); 
            
        } else if (response.status === 401 || response.status === 403) {
            alert("Sesión expirada o no autorizada.");
            window.location.href = '/login'; 
            
        } else {
            alert(`Error al publicar: ${data.message}`);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de conexión con el servidor.');
    } finally {
        btnPublicar.disabled = false; // Habilitar de nuevo en caso de fallo
    }
}


// 🔑 FUNCIÓN PARA OBTENER Y RENDERIZAR POSTS (FEED)
document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que el feed se cargue al iniciar la página
    if (postsContainer) {
        fetchAndRenderPosts(postsContainer);
    }
});

async function fetchAndRenderPosts(container) {
    try {
        const response = await fetch('/api/posts', { method: 'GET' });
        const data = await response.json();

        if (response.ok && data.posts.length > 0) {
            
            // Usamos map para crear un array de strings HTML y join('') para unirlos
            const postsHTML = data.posts.map(post => createPostCard(post)).join('');
            
            // Inyectamos el HTML en el contenedor del feed
            container.innerHTML = postsHTML;

        } else if (data.posts.length === 0) {
            container.innerHTML = '<p class="info-message">¡Sé el primero en publicar!</p>';
        } else {
            container.innerHTML = '<p class="error-message">Error cargando el feed.</p>';
        }

    } catch (error) {
        console.error("Error de red al cargar el feed:", error);
        container.innerHTML = '<p class="error-message">Error de conexión.</p>';
    }
}


/**
 * 🔑 Plantilla literal adaptada a tu estructura HTML de post-card.
 * @param {object} post Objeto de publicación desde el backend.
 * @returns {string} String HTML.
 */
function createPostCard(post) {
    // Formatear la fecha
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = new Date(post.created_at).toLocaleDateString('es-ES', dateOptions);
    
    // Asignar el nombre de usuario (si existe) o un valor por defecto
    const authorName = post.username || 'Usuario Desconocido'; 
    const likesCount = post.likes || 0;
    const commentsCount = post.comments_count || 0;

    // Adaptamos el template string a la estructura que tienes en tu HTML de ejemplo:
    return `
        <article class="post-card" data-post-id="${post.id}">
            <div class="post-card__photo-wrapper">
                <span class="material-symbols-outlined post-card__photo" aria-label="Foto de usuario">account_circle</span>
            </div>
            <div class="post-card__content">
                <div class="post-card__info">
                    <h2 class="post-card__name">${authorName}</h2>
                    <time class="post-card__date" datetime="${post.created_at}">${formattedDate}</time>
                </div>
                <p class="post-card__message">${post.content}</p>
                
                ${post.image ? `<img src="${post.image}" alt="Imagen de la publicación" class="post-image">` : ''}

                <footer class="post-card__footer-actions">
                    <button class="post-card__action-btn" aria-label="Dar me gusta">
                        <span class="material-symbols-outlined">favorite_border</span>
                        ${likesCount}
                    </button>
                    <button class="post-card__action-btn" aria-label="Comentar">
                        <span class="material-symbols-outlined">chat_bubble_outline</span>
                        ${commentsCount}
                    </button>
                    </footer>
            </div>
        </article>
    `;
}