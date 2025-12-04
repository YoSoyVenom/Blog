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
        //  🔥 LOGIN EXITOSO
        // ===========================
        if (response.ok) {

            // 👉 GUARDAR TOKEN
            localStorage.setItem("token", data.token);

            // 👉 GUARDAR DATOS DEL USUARIO
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("Login exitoso:", message);
            window.location = "/";
            return;
        }

        // ===========================
        //  ❌ ERROR
        // ===========================
        console.warn(`Error ${response.status}: ${message}`);
        alert(message);

    } catch (error) {
        console.error("Error de red:", error.message);
        alert("Error de conexión con el servidor.");
    }
}
