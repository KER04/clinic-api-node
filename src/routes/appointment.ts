import { Application } from "express";
import { AppointmentController } from "../controller/appointment.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createAppointmentSchema, updateAppointmentSchema } from "../schemas/entities.schema";

export class AppointmentRoutes {

    public AppointmentController: AppointmentController = new AppointmentController;

    public routes(app: Application): void {
        app.route("/api/appointment/public")
            .get(this.AppointmentController.getAllAppointment)
            .post(validate(createAppointmentSchema), this.AppointmentController.createAppointment);

        app.route("/api/appointment/public/:id")
            .get(this.AppointmentController.getAppointmentById)
            .put(validate(updateAppointmentSchema), this.AppointmentController.updateAppointment)
            .delete(this.AppointmentController.deleteAppointment);

        //Rutas protegidas
        app.route("/api/appointment")
            .get(authMiddleware, this.AppointmentController.getAllAppointment)
            .post(authMiddleware, validate(createAppointmentSchema), this.AppointmentController.createAppointment);

        app.route("/api/appointment/:id")
            .get(authMiddleware, this.AppointmentController.getAppointmentById)
            .put(authMiddleware, validate(updateAppointmentSchema), this.AppointmentController.updateAppointment)
            .delete(authMiddleware, this.AppointmentController.deleteAppointment);

    }
}