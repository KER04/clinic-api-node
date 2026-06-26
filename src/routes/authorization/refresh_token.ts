import { Application } from "express";
import { RefreshTokenController } from "../../controller/Authorization/refresh_token.controller";
export class RefreshTokenRoutes {
  public refreshTokenController: RefreshTokenController = new RefreshTokenController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    app.route("/refresh-token")
      .get(this.refreshTokenController.getAllRefreshToken);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    // Si se requieren rutas protegidas, se pueden agregar aquí:



  }
}