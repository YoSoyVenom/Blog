const validateMiddleware = (schema) => (req, res, next) => {

    try {
        schema.parse({
            body: req.body
        });

        next();
    } catch (error) {
        if (error.errors) {
            const errorMessages = error.errors.map((err) => {
                return {
                    field: err.path.at(-1),
                    message: err.message
                }
            });
            return res.status(400).json({
                status: "fail",
                errors: errorMessages
            });
        }

        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

module.exports = {
    validateMiddleware
}