// controllers/postController.js

const crypto = require("crypto"); 
const postModel = require("../models/postModel"); // 👈 Importamos el nuevo modelo

exports.createPost = async (req, res) => { // 💡 Hacemos la función ASÍNCRONA
    
    try {
        const userId = req.user.id; 
        const username = req.user.username; 
        
        const { content, date } = req.body; // Dejamos 'title' y 'content' del frontend (como en el ejemplo anterior)

        if (!content) {
            return res.status(400).json({ message: "El contenido de la publicación es requerido." });
        }

        const createdAt = date ? new Date(date).toISOString() : new Date().toISOString();

        // 1. Crear el objeto post, siguiendo la estructura de tu posts.json
        const newPost = {
            id: crypto.randomUUID(), // Usar un UUID es más seguro que un número consecutivo
            user_id: userId,         // 🔑 Usamos user_id para coincidir con tu JSON
            username: username,      // (Añadido para facilitar el frontend)
            content: content,
            image: null,             // Por defecto, sin imagen
            likes: 0,
            comments_count: 0,
            created_at: createdAt
        };
        
        // 2. 🔑 CLAVE: Llamar a la función del modelo para guardar el post
        await postModel.createPost(newPost); // Usamos await porque la operación es asíncrona

        return res.status(201).json({ 
            message: "Publicación creada con éxito.", 
            post: newPost 
        });

    } catch (error) {
        console.error("Error al crear publicación:", error);
        return res.status(500).json({
            message: "Error interno al guardar la publicación.",
            error: error.message
        });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.getAllPosts();
        return res.status(200).json({ 
            message: "Publicaciones obtenidas con éxito.", 
            posts: posts
         });
    } catch (error) {
       console.error("Error al obtener publicaciones:", error);
       return res.status(500).json({
           message: "Error interno al obtener las publicaciones.",
           error: error.message
       });
    }
}