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


// Dialog.

const modal = document.getElementById("modal-publicacion");
const textarea = document.getElementById("post-content");
const btnAbrir = document.getElementById("btn-abrir");
const btnCerrar = document.getElementById("btn-cerrar");

btnAbrir.addEventListener("click", () => {
    modal.showModal();
    textarea.focus();
    modal.classList.add("modal-visible");
});

btnCerrar.addEventListener("click", () => {
    modal.close();
    modal.classList.remove("modal-visible");
});