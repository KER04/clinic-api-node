import { Application } from "express";
import { AuthController } from "../../controller/Authorization/auth.controller";
import { loginLimiter } from "../../middleware/rateLimit";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema } from "../../schemas/auth.schema";

export class AuthRoutes {
  public authController: AuthController = new AuthController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    app.route("/api/register")
      .post(validate(registerSchema), this.authController.register);

    app.route("/api/login")
      .post(loginLimiter, validate(loginSchema), this.authController.login);

    // ================== RUTAS CON AUTENTICACIÓN ==================

  }
}