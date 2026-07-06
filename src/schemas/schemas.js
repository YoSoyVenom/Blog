const { z } = require("zod"); 

const validateDataRegister = z.strictObject({
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

module.exports = {
    validateDataRegister,
    validateDataLogin
};