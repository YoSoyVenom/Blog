// login.js

const btnLogin = document.getElementById('btn-login');
const email = document.getElementById("email");
const password = document.getElementById("password");

btnLogin.addEventListener('click', iniciarSesion);

async function iniciarSesion(e) {
    e.preventDefault();

    // VALIDAR CAMPOS VACÍOS ANTES DE ENVIAR AL SERVIDOR
    if (!email.value || !password.value) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const URL = "http://localhost:3200/api/auth/login";
    const credenciales = {
        email: email.value,
        password: password.value
    };

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciales)
        });

        const data = await response.json();
        const message = data.message;

        // ===========================
        //  🔥 LOGIN EXITOSO
        // ===========================
        if (response.ok) {

            // 🔑 ELIMINAR LÍNEA: El token ya está guardado automáticamente en la Cookie HTTP-Only por el navegador
            // No uses: localStorage.setItem("token", data.token);

            // 💡 OPCIONAL: Si necesitas el nombre de usuario para mostrar un saludo en el frontend, 
            // puedes seguir guardando data.user.username, pero el ID del usuario ya NO es necesario 
            // para el backend, solo para el frontend.
            localStorage.setItem("username", data.user.username); // Guardar solo el nombre si lo necesitas

            console.log("Login exitoso:", message);
            // El backend ya sugirió la redirección con data.redirect
            window.location = data.redirect || "/";
            return;
        }

        // ===========================
        //  ❌ ERROR
        // ===========================
        console.warn(`Error ${response.status}: ${message}`);
        alert(message);

    } catch (error) {
        console.error("Error de red:", error.message);
        alert("Error de conexión con el servidor.");
    }
}