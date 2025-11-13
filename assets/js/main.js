const aside = document.querySelector("#sidebar");
const btnProfile = document.querySelector("#btn-profile");
const header = document.querySelector("#encabezado-position");
btnProfile.addEventListener("click", () => {
    aside.classList.toggle("aside-visible");
    header.classList.toggle("header-zindex");
})

