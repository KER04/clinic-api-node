import { Application } from "express";
import { AuthController } from "../../controller/Authorization/auth.controller";
import { loginLimiter } from "../../middleware/rateLimit";

export class AuthRoutes {
  public authController: AuthController = new AuthController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    app.route("/api/register")
      .post(this.authController.register);

    app.route("/api/login")
      .post(loginLimiter, this.authController.login);

    // ================== RUTAS CON AUTENTICACIÓN ==================

  }
}