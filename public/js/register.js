const btnRegister = document.getElementById('btn-register');
const username = document.getElementById("formulario__nombre");
const errorUsername = document.getElementById("username__error");
const email = document.getElementById("formulario__email");
const errorEmail = document.getElementById("email__error");
const password = document.getElementById("formulario__password");
const errorPassword = document.getElementById("password__error");
const confirmPassword = document.getElementById("formulario__confirm_password");
const errorConfirmPassword = document.getElementById("confirm__password__error");
const biografia = document.getElementById("formulario__biografia");
const errorBiografia = document.getElementById("biografia__error");
const formularioResponse = document.getElementById("formulario__response");

// El backend devuelve mas de una respuesta

btnRegister.addEventListener('click', register);

function validateForm(username, errorUsername, email, errorEmail, password, errorPassword, confirmPassword, errorConfirmPassword, biografia, errorBiografia) {
    // VALIDACIONES DE EXISTENCIA

    if (!username) {
        errorUsername.innerText = "USERNAME_IS_REQUIRED";
        return true;
    }

    if (!email) {
        errorEmail.innerText = "EMAIL_IS_REQUIRED";
        return true;
    }

    if (!password) {
        errorPassword.innerText = "PASSWORD_IS_REQUIRED";
        return true;
    }

    if (!confirmPassword) {
        errorConfirmPassword.innerText = "CONFIRM_PASSWORD_IS_REQUIRED";
        return true;
    }

    if (!biografia) {
        errorBiografia.innerHTML = "BIOGRAPHY_IS_REQUIRED";
        return true;
    }

    // VALIDACIONES DE FORMATO.

    if (username.length < 3 || username.length > 15) {
        errorUsername.innerText = "THE_PASSWORD_MUST_BE_BETWEEN_THREE_AND_TWENTY_CHARACTERS";
        return true;
    }

    if (!email.includes("@") || !email.includes(".")) {
        errorEmail.innerText = "EMAIL_MUST_INCLUDE_@_AND_.";
        return true;
    }

    if (password.length < 8 || password.length > 20) {
        errorPassword.innerText = "THE_PASSWORD_MUST_BE_BETWEEN_EIGHT_AND_TWENTY_CHARACTERS";
        return true;
    }

    if (password !== confirmPassword) {
        errorConfirmPassword.innerText = "THE_PASSWORDS_ARE_NOT_MATCH";
        return true;
    }

    return false;
}

function emptyFields(errorFields) {
    for (const field of errorFields) {
        field.innerText = "";
    }
}

async function register(e) {
    e.preventDefault();

    console.log({errorUsername, errorEmail, errorPassword, errorConfirmPassword, errorBiografia})

    const errorFields = [errorUsername, errorEmail, errorPassword, errorConfirmPassword, errorBiografia];

    emptyFields(errorFields);

    const validation = validateForm(
        username.value, 
        errorUsername, 
        email.value, 
        errorEmail, 
        password.value, 
        errorPassword, 
        confirmPassword.value, 
        errorConfirmPassword, 
        biografia.value, 
        errorBiografia
    );

    if (validation) {
        return;
    }

    const URL = "/register";

    const infoNewUser = {
        username: username.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        bio: biografia.value
    };

    try {

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(infoNewUser)
        });

        const data = await response.json();
        const message = data.message;

        if (response.ok) {
            formularioResponse.style.color = "#50C878";
            formularioResponse.innerText = message;
            window.location = "/home";
            return;
        }

        formularioResponse.innerText = message;

    } catch (error) {
        formularioResponse.innerText = "CONNECTION_ERROR";
    }
}
