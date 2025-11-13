const menuToggle = document.querySelector('.encabezado__desplegar');
const menuList = document.querySelector('.encabezado__navegacion');
const btnLogin = document.getElementById('btn-login');

menuToggle.addEventListener('click', () => {
    menuList.classList.toggle('encabezado__lista--visible');
});

btnLogin.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'main.html';
});