import { z } from "zod";

// Login: solo validamos formato. La contraseña real se verifica con bcrypt en el controlador,
// por eso aquí solo exigimos que venga (no una longitud mínima que bloquee usuarios existentes).
export const loginSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

// Register: reglas alineadas con los validadores del frontend (username min 2, password min 6).
export const registerSchema = z.object({
  username: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("El email no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  avatar: z.string().optional(),
});
