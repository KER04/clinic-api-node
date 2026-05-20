import { Application } from "express";
import { SpecialtyController } from "../controller/specialty.controller";
import { authMiddleware } from "../middleware/auth";

export class SpecialtyRoutes {

    public SpecialtyController: SpecialtyController = new SpecialtyController;

    public routes(app: Application): void {
        app.route("/api/specialty/public")
            .get(this.SpecialtyController.getAllSpecialties)
            .post(this.SpecialtyController.createSpecialty);

        app.route("/api/specialty/public/:id")
            .get(this.SpecialtyController.getSpecialtyById)
            .put(this.SpecialtyController.updateSpecialty)
            .delete(this.SpecialtyController.deleteSpecialty);

        //Rutas con autenticación
        app.route("/api/specialty")
            .get(authMiddleware, this.SpecialtyController.getAllSpecialties)
            .post(authMiddleware, this.SpecialtyController.createSpecialty);

        app.route("/api/specialty/:id")
            .get(authMiddleware, this.SpecialtyController.getSpecialtyById)
            .put(authMiddleware, this.SpecialtyController.updateSpecialty)
            .delete(authMiddleware, this.SpecialtyController.deleteSpecialty);

    }
}