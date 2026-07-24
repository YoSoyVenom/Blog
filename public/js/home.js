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

const postsContainer = document.querySelector(".main__feed");

const modal = document.getElementById("modal-publicacion");
const textarea = document.getElementById("post-content");
const dateInput = document.getElementById("modal-fecha"); 
const btnAbrir = document.getElementById("btn-abrir");
const btnCerrar = document.getElementById("btn-cerrar");
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
    postForm.reset(); 
    btnPublicar.disabled = true; 
});

textarea.addEventListener('input', () => {
    btnPublicar.disabled = textarea.value.trim() === '';
});


const usernameObject = document.getElementById("sidebar__username");

async function showDataUser() {
    const URL = "/home/me";

    try {
        const response = await fetch(URL, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok) {
            usernameObject.innerText = data.username
        }

        if (response.status === 401) {
            return window.location.href = "/login";
        }

    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR");
    }
}

document.addEventListener("DOMContentLoaded", showDataUser);