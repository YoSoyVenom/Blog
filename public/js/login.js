const btnLogin = document.getElementById('btn-login');
const email = document.getElementById("email");
const password = document.getElementById("password");
const formularioResponse = document.getElementById("formulario__response");

async function iniciarSesion(e) {
    e.preventDefault();

    if (!email.value || !password.value) {
        formularioResponse.innerText = "THE_FIELDS_ARE_REQUIREDS";
        return;
    }

    const URL = "/login";

    const credenciales = {
        email: email.value,
        password: password.value
    };

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(credenciales)
        });

        const data = await response.json();
        const message = data.message;

        if (response.ok) {
            formularioResponse.style.color = "#50C878";
            formularioResponse.innerText = message;
            window.location.href = "/home";
            return;
        }

        formularioResponse.innerText = message;

    } catch (error) {
        formularioResponse.innerText = "CONNECTION_ERROR";
        console.error(error);
    }
}

btnLogin.addEventListener('click', iniciarSesion);