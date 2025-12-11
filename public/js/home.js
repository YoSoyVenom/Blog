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


// post.js

// Dialog (Tu código existente)
const modal = document.getElementById("modal-publicacion");
const textarea = document.getElementById("post-content");
const btnAbrir = document.getElementById("btn-abrir");
const btnCerrar = document.getElementById("btn-cerrar");

// Nuevas referencias al formulario y al botón de publicar
const postForm = modal.querySelector(".modal__formulario");
const btnPublicar = modal.querySelector(".modal__btn-publicar");


btnAbrir.addEventListener("click", () => {
    modal.showModal();
    textarea.focus();
    modal.classList.add("modal-visible");
});

btnCerrar.addEventListener("click", () => {
    modal.close();
    modal.classList.remove("modal-visible");
    postForm.reset(); // Limpiar el formulario al cerrar
});


// 1. Habilitar/Deshabilitar el botón Publicar basado en el contenido del textarea
textarea.addEventListener('input', () => {
    btnPublicar.disabled = textarea.value.trim() === '';
});


// 2. 🔑 CLAVE: Manejar el envío del formulario con FETCH
postForm.addEventListener('submit', enviarPublicacion);

async function enviarPublicacion(e) {
    e.preventDefault(); // Detener el envío tradicional del formulario

    // Obtener los datos del formulario
    const content = textarea.value.trim();
    // Nota: Si quieres incluir el campo de fecha, también debes obtener su valor aquí.
    
    // Si no hay contenido (aunque el botón esté deshabilitado, mejor verificar)
    if (!content) return;

    const URL_POST = "http://localhost:3200/api/posts/create"; // 👈 Tu ruta protegida

    try {
        const response = await fetch(URL_POST, {
            method: 'POST',
            // 💡 IMPORTANTE: El navegador enviará la cookie JWT automáticamente
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // Nota: Tu backend espera 'content' y quizás 'title'
                // Agregamos un título simple si no tienes un campo dedicado en el modal
                title: content.substring(0, 50) + '...', // Título de ejemplo
                content: content
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Publicación exitosa
            alert(data.message + " Autor: " + data.post.username);
            
            // Cerrar modal y resetear
            modal.close();
            modal.classList.remove("modal-visible");
            postForm.reset();
            btnPublicar.disabled = true;

            // Aquí deberías recargar dinámicamente tu feed
            
        } else if (response.status === 401 || response.status === 403) {
            // Sesión expirada o no autorizado (El middleware falló)
            alert("Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.");
            window.location.href = '/login'; 
            
        } else {
            // Otros errores del servidor (ej. 400 Bad Request)
            alert(`Error al publicar: ${data.message}`);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de conexión con el servidor. Inténtalo más tarde.');
    }
}