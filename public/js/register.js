const btnRegister = document.getElementById('btn-register');
const username = document.getElementById("formulario__nombre");
const email = document.getElementById("formulario__email");
const password = document.getElementById("formulario__password");
const confirmPassword = document.getElementById("formulario__confirm_password");

btnRegister.addEventListener('click', register);

async function register(e) {
    e.preventDefault();
    const URL = "http://localhost:3200/api/auth/register";
    const arrayEmail = Array.from(email.value);
    if (!arrayEmail.includes("@") || !arrayEmail.includes(".")) {
        return alert("Tu email no cumple con los requerimientos necesarios. Intenta con otro correo.");
    }
    if (!(password.value === confirmPassword.value)) {
        return alert("Tus contraseñas no son las mismas.");
    }

    const infoNewUser = {
        username: username,
        email: email,
        password: password
    }

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
            window.location = "/";
            return alert(`Felicitaciones! Estás registrado: ${message}.`);
        } 
        console.log(`Error de red ${response.status}: ${message}`);
        return alert(message);
    } catch (error) {
        console.log(`Error de red: ${error.message}`);
    }
}