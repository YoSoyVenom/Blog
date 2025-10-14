const menuToggle = document.querySelector('.encabezado__desplegar');
const menuList = document.querySelector('.encabezado__lista');

menuToggle.addEventListener('click', () => {
    menuList.classList.toggle('encabezado__lista--visible');
});