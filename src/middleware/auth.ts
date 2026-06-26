import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/authorization/user";
import { Role } from "../models/authorization/role";
import { ResourceRole } from "../models/authorization/ResourceRole";
import { Resource } from "../models/authorization/resource";
import { RoleUser } from "../models/authorization/RoleUser";
import { match } from "path-to-regexp";
import { JWT_SECRET } from "../config/jwt";
import "../models/authorization/relation"; // Importar relaciones

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // ✅ Obtiene la ruta actual correctamente cuando se usa router.use("/api/private", authMiddleware)
  const currentRoute: string = `${req.baseUrl ?? ""}${req.path ?? ""}`;
  const currentMethod: string = req.method;

  if (!token) {
    res.status(401).json({
      error: "Acceso denegado: No se proporcionó el token principal.",
    });
    return;
  }

  try {
    // 🔐 Verificar el token principal
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // 👤 Buscar el usuario activo
    const user = await User.findOne({
      where: { id: decoded.id, is_active: "ACTIVE" },
    });

    if (!user) {
      res.status(401).json({ error: "Usuario no encontrado o inactivo." });
      return;
    }

    // ✅ Validar autorización por rol y recurso
    const isAuthorized = await validateAuthorization(decoded.id, currentRoute, currentMethod);

    if (!isAuthorized) {
      res.status(403).json({ error: "No está autorizado para ejecutar esta petición." });
      return;
    }

    req.currentUser = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "El token principal ha expirado." });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Token inválido." });
    } else {
      res.status(500).json({
        error: "Error interno del servidor.",
        details: error.message,
      });
    }
  }
};

// 🔒 Función que valida si el usuario tiene permisos sobre el recurso solicitado
export const validateAuthorization = async (
  userId: number,
  resourcePath: string,
  resourceMethod: string
): Promise<boolean> => {
  try {
    // 1️⃣ Buscar recursos activos que coincidan con el método
    const resources = await Resource.findAll({
      where: { method: resourceMethod, is_active: "ACTIVE" },
    });

    // 2️⃣ Buscar el recurso que coincida con la ruta
    const matchingResource = resources.find((r) => {
      const isMatch = match(r.path, { decode: decodeURIComponent });
      return !!isMatch(resourcePath);
    });

    if (!matchingResource) {
      console.log("⛔ No se encontró un recurso que coincida con la ruta y el método:", resourcePath);
      return false;
    }

    // 3️⃣ Verificar si el usuario tiene roles con acceso al recurso
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          where: { is_active: "ACTIVE" },
          through: { where: { is_active: "ACTIVE" } },
          include: [
            {
              model: Resource,
              where: {
                id: matchingResource.id,
                is_active: "ACTIVE",
              },
              through: { where: { is_active: "ACTIVE" } },
            },
          ],
        },
      ],
    });

    // 4️⃣ Retornar true si tiene acceso
    const autorizado = !!user;
    if (!autorizado) {
      console.log(`🚫 Usuario ${userId} no autorizado para acceder a ${resourcePath}`);
    }
    return autorizado;
  } catch (error) {
    console.error("❌ Error al validar la autorización:", error);
    return false;
  }
};
