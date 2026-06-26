import dotenv from "dotenv";

dotenv.config();

// El servidor NO debe arrancar sin un JWT_SECRET real.
// Si falta, lanzamos un error en vez de usar una clave conocida ("secret").
if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET no está definido en .env. Define una clave secreta larga y aleatoria antes de iniciar el servidor."
  );
}

export const JWT_SECRET: string = process.env.JWT_SECRET;
