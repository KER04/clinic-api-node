import { Application } from "express";
import { PrescriptionDetailController } from "../controller/prescriptionDetail.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createPrescriptionDetailSchema, updatePrescriptionDetailSchema } from "../schemas/entities.schema";

export class PrescriptionDetailRoutes {

    public prescriptionDetailController: PrescriptionDetailController = new PrescriptionDetailController;

    public routes(app: Application): void {
        app.route("/api/prescriptionDetail/public")
            .get(this.prescriptionDetailController.getAllPrescriptionDetails)
            .post(validate(createPrescriptionDetailSchema), this.prescriptionDetailController.createPrescriptionDetail);

        app.route("/api/prescriptionDetail/public/:id")
            .get(this.prescriptionDetailController.getPrescriptionDetailById)
            .put(validate(updatePrescriptionDetailSchema), this.prescriptionDetailController.updatePrescriptionDetail)
            .delete(this.prescriptionDetailController.deletePrescriptionDetail);

        // Rutas que requieren autenticación
        app.route("/api/prescriptionDetail")
            .get(authMiddleware, this.prescriptionDetailController.getAllPrescriptionDetails)
            .post(authMiddleware, validate(createPrescriptionDetailSchema), this.prescriptionDetailController.createPrescriptionDetail);

        app.route("/api/prescriptionDetail/:id")
            .get(authMiddleware, this.prescriptionDetailController.getPrescriptionDetailById)
            .put(authMiddleware, validate(updatePrescriptionDetailSchema), this.prescriptionDetailController.updatePrescriptionDetail)
            .delete(authMiddleware, this.prescriptionDetailController.deletePrescriptionDetail);
    }
}