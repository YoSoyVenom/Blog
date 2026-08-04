import { fetchWithAuth } from "./base.js";

// ASIDE CODE
const aside = document.getElementById("sidebar");
const btnAsideProfile = document.getElementById("btn-profile");
const header = document.getElementById("encabezado");
const headerHeight = header.offsetHeight;

function ajustarClasePorResolucion() {
    const anchoVentana = window.innerWidth;
    if (anchoVentana < 768) {
        aside.style.top = `${headerHeight}px`;
        aside.style.height = `calc(100dvh - ${headerHeight}px)`;
        btnAsideProfile.style.display = "block";
        btnAsideProfile.addEventListener("click", () => {
            aside.classList.toggle("aside-visible");
        })
    } else {
        aside.style.top = `calc(${headerHeight}px + 20px)`;
        aside.classList.remove("aside-visible");
        btnAsideProfile.style.display = "none";
    }
}
window.addEventListener("resize", ajustarClasePorResolucion);
ajustarClasePorResolucion();

const postsContainer = document.querySelector(".main__feed");

// MOSTRAR INFORMACIÓN DEL USUARIO

const usernameObject = document.getElementById("sidebar__username");

async function mostrarInfoUsuario() {
    const url = "/home/me";

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok) {
            usernameObject.innerText = data.username;
        } else if (response.status === 401) {
            const refreshed = await fetchWithAuth();
        
            if (refreshed) {
                return mostrarInfoUsuario();
            }
        
            window.location.href = "/login";
        }

    } 
    catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", mostrarInfoUsuario);

// LOG OUT

const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
const simboloCerrarSesion = document.getElementById("simbolo-cerrar-sesion");

btnCerrarSesion.addEventListener("click", cerrarSesion);
simboloCerrarSesion.addEventListener("click", cerrarSesion);

async function cerrarSesion() {
    try {
        const response = await fetch("/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "/login";
            return;
        }

        const data = await response.json();
        console.error(data.message);

    } catch (error) {
        console.error(error);
    }
}