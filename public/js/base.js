const menuToggle = document.querySelector('.encabezado__desplegar');
const menuList = document.querySelector('.encabezado__navegacion');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('encabezado__lista--visible');
    });
}