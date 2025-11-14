const aside = document.querySelector("#sidebar");
const btnProfile = document.querySelector("#btn-profile");

btnProfile.addEventListener("click", () => {
    aside.classList.toggle("aside-visible");
})

