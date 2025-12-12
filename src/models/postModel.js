// models/postModel.js

const fs = require('fs/promises'); // Usamos la versión de promesas para operaciones asíncronas
const path = require('path');

// Ruta al archivo de datos de posts
const POSTS_FILE = path.join(__dirname, '..', "..", 'database', 'posts.json');

/**
 * Lee el archivo posts.json y devuelve todos los posts.
 * @returns {Promise<Array>} Un array de objetos de publicación.
 */
async function getAllPosts() {
    try {
        const data = await fs.readFile(POSTS_FILE, 'utf-8');
        const json = JSON.parse(data);
        return json.posts;
    } catch (error) {
        // Si el archivo no existe o hay un error de lectura/parseo, retorna un array vacío
        if (error.code === 'ENOENT') {
            console.warn(`Archivo de posts no encontrado en ${POSTS_FILE}. Creando uno vacío.`);
            return [];
        }
        console.error("Error al leer posts.json:", error);
        throw new Error("Fallo al cargar las publicaciones.");
    }
}

/**
 * Escribe el array de posts de vuelta al archivo posts.json.
 * @param {Array} posts El array completo de publicaciones a guardar.
 */
async function savePosts(posts) {
    try {
        const jsonContent = JSON.stringify({ posts }, null, 4); // El 'null, 4' es para formato legible
        await fs.writeFile(POSTS_FILE, jsonContent, 'utf-8');
    } catch (error) {
        console.error("Error al guardar posts.json:", error);
        throw new Error("Fallo al guardar la nueva publicación.");
    }
}

/**
 * Crea una nueva publicación y la añade al archivo posts.json.
 * @param {object} newPost El objeto de la nueva publicación (con id, userId, content, etc.).
 */
async function createPost(newPost) {
    // 1. Obtener todos los posts existentes
    const posts = await getAllPosts();

    // 2. Añadir el nuevo post al inicio del array (para que aparezca primero en el feed)
    posts.unshift(newPost);

    // 3. Guardar el array completo de vuelta al archivo
    await savePosts(posts);
}

module.exports = {
    getAllPosts,
    createPost
};