import { Application } from "express";
import { DiagnosisController } from "../controller/diagnosis.controller";
import { authMiddleware } from "../middleware/auth";
export class DiagnosisRoutes {

    public diagnosisController: DiagnosisController = new DiagnosisController;

    public routes(app: Application): void {
        app.route("/api/diagnosis/public")
            .get(this.diagnosisController.getAllDiagnosis)
            .post(this.diagnosisController.createDiagnosis);

        app.route("/api/diagnosis/public/:id")
            .get(this.diagnosisController.getDiagnosisById)
            .put(this.diagnosisController.updateDiagnosis)
            .delete(this.diagnosisController.deleteDiagnosis);

        // Rutas con autenticación
        app.route("/api/diagnosis")
            .get(authMiddleware, this.diagnosisController.getAllDiagnosis)
            .post(authMiddleware, this.diagnosisController.createDiagnosis);

        app.route("/api/diagnosis/:id")
            .get(authMiddleware, this.diagnosisController.getDiagnosisById)
            .put(authMiddleware, this.diagnosisController.updateDiagnosis)
            .delete(authMiddleware, this.diagnosisController.deleteDiagnosis);
    }
}