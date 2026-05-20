import { Application } from "express";
import { DoctorController } from "../controller/doctor.controller";
import { authMiddleware } from "../middleware/auth";
export class DoctorRoutes {
    public DoctorController: DoctorController = new DoctorController;

    public routes(app: Application): void {
        app.route("/api/doctor/public")
            .get(this.DoctorController.getAllDoctor)
            .post(this.DoctorController.createDoctor);

        app.route("/api/doctor/public/:id")
            .get(this.DoctorController.getDoctorById)
            .put(this.DoctorController.updateDoctor)
            .delete(this.DoctorController.deleteDoctor);

        //Rutas protegidas
        app.route("/api/doctor")
            .get(authMiddleware, this.DoctorController.getAllDoctor)
            .post(authMiddleware, this.DoctorController.createDoctor);

        app.route("/api/doctor/:id")
            .get(authMiddleware, this.DoctorController.getDoctorById)
            .put(authMiddleware, this.DoctorController.updateDoctor)
            .delete(authMiddleware, this.DoctorController.deleteDoctor);
    }
}