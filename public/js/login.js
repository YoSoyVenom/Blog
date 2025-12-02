const btnLogin = document.getElementById('btn-login');
const email = document.getElementById("email");
const password = document.getElementById("password");

btnLogin.addEventListener('click', iniciarSesion);

async function iniciarSesion(e) {
    e.preventDefault();
    const URL = "http://localhost:3200/api/auth/login";
    const credenciales = {
        email: email.value,
        password: password.value
    }
    try {
        // PETICIÓN PARA COMPROBAR LOS DATOS DEL USUARIO.
        const response = await fetch(URL, {
            method: "POST",

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(credenciales)
        });

        const data = await response.json();
        const message = data.message;

        // SI LA PETICIÓN SE CUMPLE.
        if (response.ok) {
            window.location = "/";
            console.log(message);
        } else {
            console.log(`Fallo en la autentificación ${response.status}: ${message}`)
            alert(message);
        }
    } catch (error) {
        console.log(`Error de red: ${error.message}`);
    }
}