import { Application } from "express";
import { PatientController } from "../controller/patients.controller";
import { authMiddleware } from "../middleware/auth";
export class PatientRoutes {
    public patientController: PatientController = new PatientController;

    public routes(app: Application): void {
        app.route("/api/patient/public").get(this.patientController.getAllPatients);
        app.route("/api/patient/public/:id").get(this.patientController.getPatientById);
        app.route("/api/patient/public").post(this.patientController.createPatient);
        app.route("/api/patient/public/:id").put(this.patientController.updatePatient);
        app.route("/api/patient/public/:id").delete(this.patientController.deletePatient);


        //rutas protegidas
        app.route("/api/patient").get(authMiddleware, this.patientController.getAllPatients);
    }
}