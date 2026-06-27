import { Application } from "express";
import { SpecialtyController } from "../controller/specialty.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createSpecialtySchema, updateSpecialtySchema } from "../schemas/entities.schema";

export class SpecialtyRoutes {

    public SpecialtyController: SpecialtyController = new SpecialtyController;

    public routes(app: Application): void {
        app.route("/api/specialty/public")
            .get(this.SpecialtyController.getAllSpecialties)
            .post(validate(createSpecialtySchema), this.SpecialtyController.createSpecialty);

        app.route("/api/specialty/public/:id")
            .get(this.SpecialtyController.getSpecialtyById)
            .put(validate(updateSpecialtySchema), this.SpecialtyController.updateSpecialty)
            .delete(this.SpecialtyController.deleteSpecialty);

        //Rutas con autenticación
        app.route("/api/specialty")
            .get(authMiddleware, this.SpecialtyController.getAllSpecialties)
            .post(authMiddleware, validate(createSpecialtySchema), this.SpecialtyController.createSpecialty);

        app.route("/api/specialty/:id")
            .get(authMiddleware, this.SpecialtyController.getSpecialtyById)
            .put(authMiddleware, validate(updateSpecialtySchema), this.SpecialtyController.updateSpecialty)
            .delete(authMiddleware, this.SpecialtyController.deleteSpecialty);

    }
}