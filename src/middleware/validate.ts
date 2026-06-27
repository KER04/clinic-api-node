import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

// Middleware reutilizable: valida req.body contra un esquema de Zod.
// Si falla, responde 400 con los errores por campo y NO llega al controlador.
// Si pasa, reemplaza req.body con los datos ya validados/tipados.
export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "_error";
        (errors[key] ??= []).push(issue.message);
      }
      res.status(400).json({ errors });
      return;
    }

    req.body = result.data;
    next();
  };
