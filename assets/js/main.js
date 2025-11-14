const aside = document.querySelector("#sidebar");
const btnProfile = document.querySelector("#btn-profile");
const header = document.querySelector("#encabezado");

const headerHeight = header.offsetHeight;
aside.style.top = `${headerHeight}px`;
aside.style.height = `calc(100dvh - ${headerHeight}px)`;

btnProfile.addEventListener("click", () => {
    aside.classList.toggle("aside-visible");
})

