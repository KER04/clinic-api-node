import { Application } from "express";
import { DoctorController } from "../controller/doctor.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createDoctorSchema, updateDoctorSchema } from "../schemas/entities.schema";
export class DoctorRoutes {
    public DoctorController: DoctorController = new DoctorController;

    public routes(app: Application): void {
        app.route("/api/doctor/public")
            .get(this.DoctorController.getAllDoctor)
            .post(validate(createDoctorSchema), this.DoctorController.createDoctor);

        app.route("/api/doctor/public/:id")
            .get(this.DoctorController.getDoctorById)
            .put(validate(updateDoctorSchema), this.DoctorController.updateDoctor)
            .delete(this.DoctorController.deleteDoctor);

        //Rutas protegidas
        app.route("/api/doctor")
            .get(authMiddleware, this.DoctorController.getAllDoctor)
            .post(authMiddleware, validate(createDoctorSchema), this.DoctorController.createDoctor);

        app.route("/api/doctor/:id")
            .get(authMiddleware, this.DoctorController.getDoctorById)
            .put(authMiddleware, validate(updateDoctorSchema), this.DoctorController.updateDoctor)
            .delete(authMiddleware, this.DoctorController.deleteDoctor);
    }
}