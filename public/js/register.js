const btnRegister = document.getElementById('btn-register');
const username = document.getElementById("formulario__nombre");
const email = document.getElementById("formulario__email");
const password = document.getElementById("formulario__password");
const confirmPassword = document.getElementById("formulario__confirm_password");

btnRegister.addEventListener('click', register);

async function register(e) {
    e.preventDefault();

    const URL = "http://localhost:3200/api/auth/register";

    // VALIDACIÓN EMAIL
    if (!email.value.includes("@") || !email.value.includes(".")) {
        return alert("Tu email no cumple con los requerimientos necesarios.");
    }

    // VALIDACIÓN CONTRASEÑAS
    if (password.value !== confirmPassword.value) {
        return alert("Tus contraseñas no coinciden.");
    }

    // OBJETO CORRECTO
    const infoNewUser = {
        username: username.value,
        email: email.value,
        password: password.value
    };

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(infoNewUser)
        });

        const data = await response.json();
        const message = data.message;

        if (response.ok) {
            alert(`Felicitaciones! Estás registrado: ${message}.`);
            window.location = "/";
            return;
        }

        console.log(`Error ${response.status}: ${message}`);
        alert(message);

    } catch (error) {
        console.log(`Error de red: ${error.message}`);
    }
}
