const aside = document.querySelector("#sidebar");
const btnProfile = document.querySelector("#btn-profile");
const header = document.querySelector("#encabezado");

const headerHeight = header.offsetHeight;

function ajustarClasePorResolucion() {
    const anchoVentana = window.innerWidth;
    console.log(anchoVentana);
    if (anchoVentana < 768) {
        aside.style.top = `${headerHeight}px`;
        aside.style.height = `calc(100dvh - ${headerHeight}px)`;
        btnProfile.addEventListener("click", () => {
            aside.classList.toggle("aside-visible");
        })
    } else {
        aside.style.top = `calc(${headerHeight}px + 20px)`;
        aside.classList.remove("aside-visible");
    }
}
window.addEventListener("resize", ajustarClasePorResolucion);
ajustarClasePorResolucion();