// Importación de funciones service para los likes a los comentarios.
const { findCommentLike, createCommentLike, deleteCommentLike } = require("../services/commentLikeService");
// Importación de funciones service para los comentarios.
const { getComments, createComment, deleteComment, getAnswers } = require("../services/commentService");

// Función que obtiene los comentarios de un post.
async function getCommentsController(req, res) {
    try {
        // Datos para obtener los comentarios del post.
        const userId = req.user.id;
        const postId = req.params.postId;

        // Obtiene los comentarios del post.
        const comments = await getComments(userId, postId);

        // Retorna los comentarios.
        return res.status(200).json( comments );
    } catch (error) {
        // Retorna el mensaje de error al Front.
        return res.status(500).json({ message: error.message });
    }
}

// Función que controla el dar like.
async function toggleCommentLikeController(req, res) {
    try {

        // Datos para dar like.
        const userId = req.user.id;
        const commentId = Number(req.params.commentId);

        // Valor booleano que decide si se agrega o no el like.
        const isLiked = await findCommentLike(userId, commentId);

        if (!isLiked) {
            // Si el valor el false se crea el like.
            await createCommentLike(userId, commentId);
            // Devuelve que se le dió like al comentario.
            return res.status(200).json({ message: "LIKE_CREATED", liked: true });
        }

        // Elimina el like si es true.
        await deleteCommentLike(userId, commentId);

        // Devuelve que se quitó el like.
        return res.status(200).json({ message: "LIKE_DELETED", liked: false});

    } catch (error) {

        // Ayuda a saber cual es el error (solo en producción)
        console.error(error)

        // Error en PostgreSQL.
        if (error.code == "23503") {
            // Mensaje de error.
            return res.status(404).json({ message: "COMMENT_NOT_FOUND" });
        }

        // Mensaje de error 500 si no se identifica.
        return res.status(500).json({ message: error.message });
    }
}

// Creación de un comentario.
async function createCommentController(req, res) {
    try {
        // Datos necesarios para crear un comentario.
        const userId = req.user.id;
        const { postId, content, parentCommentId = null } = req.body;

        // Crea el comentario.
        await createComment(userId, postId, content, parentCommentId);

        // Estado 201 creado.
        res.status(201).json({ message: "COMMENT_CREATED" });

    } catch (error) {
        // Manejo de error.
        return res.status(500).json({message: error.message});
    }
}

// Función para eliminar un comentario.
async function deleteCommentController(req, res) {
    try {
        // Datos necesarios para eliminar el comentario.
        const userId = req.user.id;
        const commentId = req.body.commentId;

        // Valor booleano para saber si se eliminó o no.
        const deleted = await deleteComment(commentId, userId);

        if (!deleted) {
            // Mensaje de error si no se pudo eliminar.
            return res.status(404).json({ message: "COMMENT_NOT_FOUND" });
        }

        // Mensaje de exito.
        return res.status(200).json({ message: "SUCCESFUL_DELETE" });
    } catch (error) {
        // Manejo de errores (en producción)
        console.log(error);
        // Manejo de error.
        return res.status(500).json({ message: error.message });
    }
}

// Obtiene las respuestas a un comentario.
async function getAnswersController(req, res) {
    try {
        // Datos necesarios para cargar las respuestas al comentario.
        const commentId = req.params.commentId;
        const userId = req.user.id;

        // Obtiene las respuestas.
        const answers = await getAnswers(commentId, userId);

        // Retorna las respuestas.
        return res.status(200).json( answers );
    } catch (error) {
        // Manejo de error.
        return res.status(500).json({ message: error.message });
    }
}

// Exportación de las funciones del archivo.
module.exports = {
    getCommentsController,
    toggleCommentLikeController,
    createCommentController,
    deleteCommentController,
    getAnswersController
}