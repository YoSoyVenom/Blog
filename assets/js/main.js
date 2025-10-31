const aside = document.querySelector(".sidebar");
const btnProfile = document.querySelector(".encabezado__user");
btnProfile.addEventListener("click", () => {
    aside.classList.toggle("visible");
})

