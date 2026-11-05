
// Obtener los elementos HTML.
const usernameObject = document.getElementById("username__field");
const emailObject = document.getElementById("email__field");

// Función que despliega los datos del usuario.
export async function displayProfileInfo() {
    // URL a donde hacer la petición.
    const url = "/profile/me";

    try {
        // Hace la petición.
        const response = await fetch(url, {
            method: "POST",
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
            return displayUserInfo();
        }

    }
    catch (error) {
        // Manejo de error.
        console.error(error);
    }
}

// Inicia los datos de la página.
document.addEventListener("DOMContentLoaded", displayProfileInfo);