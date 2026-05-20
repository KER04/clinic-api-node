import { PrescriptionController } from "../controller/prescription.controller";
import { Application } from "express";
import { authMiddleware } from "../middleware/auth";

export class PrescriptionRoutes {
    public prescriptionController: PrescriptionController = new PrescriptionController;

    public routes(app: Application): void {
        app.route("/api/prescriptions/public")
            .get(this.prescriptionController.getAllPrescriptions)
            .post(this.prescriptionController.createPrescription);

        app.route("/api/prescriptions/public/:id")
            .get(this.prescriptionController.getPrescriptionById)
            .put(this.prescriptionController.updatePrescription)
            .delete(this.prescriptionController.deletePrescription);

        // Rutas que requieren autenticación
        app.route("/api/prescriptions")
            .get(authMiddleware, this.prescriptionController.getAllPrescriptions)
            .post(authMiddleware, this.prescriptionController.createPrescription);

        app.route("/api/prescriptions/:id")
            .get(authMiddleware, this.prescriptionController.getPrescriptionById)
            .put(authMiddleware, this.prescriptionController.updatePrescription)
            .delete(authMiddleware, this.prescriptionController.deletePrescription);
    }
}