import { Application } from "express";
import { PrescriptionDetailController } from "../controller/prescriptionDetail.controller";
import { authMiddleware } from "../middleware/auth";

export class PrescriptionDetailRoutes {

    public prescriptionDetailController: PrescriptionDetailController = new PrescriptionDetailController;

    public routes(app: Application): void {
        app.route("/api/prescriptionDetail/public")
            .get(this.prescriptionDetailController.getAllPrescriptionDetails)
            .post(this.prescriptionDetailController.createPrescriptionDetail);

        app.route("/api/prescriptionDetail/public/:id")
            .get(this.prescriptionDetailController.getPrescriptionDetailById)
            .put(this.prescriptionDetailController.updatePrescriptionDetail)
            .delete(this.prescriptionDetailController.deletePrescriptionDetail);

        // Rutas que requieren autenticación
        app.route("/api/prescriptionDetail")
            .get(authMiddleware, this.prescriptionDetailController.getAllPrescriptionDetails)
            .post(authMiddleware, this.prescriptionDetailController.createPrescriptionDetail);

        app.route("/api/prescriptionDetail/:id")
            .get(authMiddleware, this.prescriptionDetailController.getPrescriptionDetailById)
            .put(authMiddleware, this.prescriptionDetailController.updatePrescriptionDetail)
            .delete(authMiddleware, this.prescriptionDetailController.deletePrescriptionDetail);
    }
}