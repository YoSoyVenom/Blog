const { z } = require("zod"); 

const validateDataRegister = z.object({
    body: z.object({
        username: z
            .string({ required_error: "El nombre de usuario es obligatorio" })
            .trim()
            .min(3, { message: "El nombre de usuario es muy corto" })
            .max(15, { message: "El nombre de usuario es muy largo" }),

        email: z
            .string({ required_error: "El correo es obligatorio" })
            .trim()
            .email({ message: "Formato de email inválido" }),

        password: z
            .string({ required_error: "La contraseña es obligatoria" })
            .min(8, { message: "La contraseña es muy corta" })
            .max(20, { message: "La contraseña es muy larga" })
            // 3. Corregido: Quitamos las comillas ("") de las RegEx
            .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una mayúscula" })
            .regex(/[a-z]/, { message: "La contraseña debe contener al menos una minúscula" })
            .regex(/[0-9]/, { message: "La contraseña debe tener al menos un número" })
            .regex(/[^A-Za-z0-9]/, { message: "La contraseña debe contener caracteres especiales" }),
        
        confirmPassword: z
            .string({ required_error: "Confirmar la contraseña es obligatorio" }),

        bio: z
            .string({ required_error: "Escribir una biografía" })
            .min(10, { message: "La biografía es muy corta" })
            .max(3000, { message: "La biografía es demasiado extensa." }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"]
    })
});

const validateDataLogin = z.strictObject({
    body: z.object({
        email: z
            .string({ required_error: "El correo es obligatorio" })
            .email({ message: "Formato inválido" }),

        password: z
            .string({ required_error: "La contraseña es obligatoria" })
            .min(1, { message: "La contraseña es obligatoria" }),
    })
});

const validatePost = z.strictObject({
    body: z.object({
        content: z
            .string({ required_error: "El contenido del post es obligatorio" })
            .trim()
            .min(10, { message: "El mensaje es muy corto" })
            .max(5000, { message: "El mensaje es demasiado extenso" })
    })
});

const validateComment = z.strictObject({
    body: z.object({
        postId: z
            .number().int().positive(),
        content: z
            .string({ required_error: "El contenido del post es obligatorio" })
            .trim()
            .min(10, { message: "El mensaje es muy corto" })
            .max(5000, { message: "El mensaje es demasiado extenso" }),
        parentCommentId: z
            .number().nullable().optional()
    })
});


module.exports = {
    validateDataRegister,
    validateDataLogin,
    validatePost,
    validateComment
};