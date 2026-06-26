import rateLimit from "express-rate-limit";

// Limita los intentos de login para frenar ataques de fuerza bruta:
// máximo 5 intentos por IP cada 15 minutos.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos." },
});
