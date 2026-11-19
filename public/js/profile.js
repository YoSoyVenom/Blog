import { requestWithAuth } from "./base.js";
import { renderPosts } from "./posts.js";

// Obtener los elementos HTML.
const usernameObject = document.getElementById("username__field");
const emailObject = document.getElementById("email__field");
// Contenedor de publicaciones.
const postsFeed = document.getElementById("main__post");

// Función que despliega los datos del usuario.
async function displayProfileInfo() {
    // URL a donde hacer la petición.
    const url = "/profile/me";

    try {
        // Hace la petición.
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        // Transforma la información obtenida del BackEnd.
        const data = await response.json();

        if (response.ok) {
            // Muestra el nombre de usuario en el html.
            usernameObject.innerText = data[0].username;
            // Muestra el email en el html.
            emailObject.innerText = data[0].email;
        } else if (response.status === 401) {
            // Función que válida que el usuario tenga sesión.
            await requestWithAuth();
            // Recursión de displayUserInfo.
            return displayProfileInfo();
        }

    }
    catch (error) {
        // Manejo de error.
        console.error(error);
    }
}

// Función que carga los posts.
async function loadProfilePosts() {
    // URL a dónde debe hacer la petición.
    const url = "/profile/posts";

    try {
        // Solicitud al BackEnd.
        const response = await fetch(url, {
            method: "GET"
        });

        // Datos que se puedan leer.
        const userPosts = await response.json();
        
        if (userPosts.length === 0) {
            console.log("No hay publicaciones");
            return;
        }

        // Renderizar los posts .
        renderPosts(postsFeed,userPosts);

    } catch (error) {
        // Manejo de error.
        console.log(error);
    }
}

// Inicia los datos de la página.
document.addEventListener("DOMContentLoaded", initProfile);

// Función que inicializa la página.
async function initProfile() {
    // Llamado a función que carga los datos de usuario.
    await displayProfileInfo();
    // Llamado a función que carga los posts.
    await loadProfilePosts();
}


// FALTA HACER ALGO REAL CUANDO NO HAY PUBLICACIONES Y HACER FUNCIONAL LA INTERACCIÓN DE LOS POSTS.