import { Application } from "express";
import { PatientController } from "../controller/patients.controller";
import { authMiddleware } from "../middleware/auth";
export class PatientRoutes {
    public patientController: PatientController = new PatientController;

    public routes(app: Application): void {
        app.route("/api/patient/public")
            .get(this.patientController.getAllPatients)
            .post(this.patientController.createPatient);

        app.route("/api/patient/public/:id")
            .get(this.patientController.getPatientById)
            .put(this.patientController.updatePatient)
            .delete(this.patientController.deletePatient);

        //Rutas protegidas
        app.route("/api/patient")
            .get(authMiddleware, this.patientController.getAllPatients)
            .post(authMiddleware, this.patientController.createPatient);

        app.route("/api/patient/:id")
            .get(authMiddleware, this.patientController.getPatientById)
            .put(authMiddleware, this.patientController.updatePatient)
            .delete(authMiddleware, this.patientController.deletePatient);
    }
}