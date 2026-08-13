// Variables para menu desplegable.
const menuToggle = document.querySelector('.encabezado__desplegar');
const menuList = document.querySelector('.encabezado__navegacion');

// Válida que el elemento html menuToggle exista.
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('encabezado__lista--visible');
    });
}

// Función intermedia a la validación de sesión.
export async function requestWithAuth() {
    // Llamado a la función de validación de sesión.
    const refreshed = await fetchWithAuth();
    // Válida la respuesta a la función.
    if (refreshed) {
        // Muestra la información del usuario.
        return mostrarInfoUsuario();
    }
    // Redirige a iniciar sesión si no hay sesión.
    window.location.href = "/login";
}

// Función de validación de sesión.
export async function fetchWithAuth() {
    const response = await fetch("/refresh", {
        method: "POST",
        credentials: "include"
    });

    return response.ok;
}