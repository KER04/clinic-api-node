import { Application } from "express";
import { AppointmentController } from "../controller/appointment.controller";
import { authMiddleware } from "../middleware/auth";

export class AppointmentRoutes {

    public AppointmentController: AppointmentController = new AppointmentController;

    public routes(app: Application): void {
        app.route("/api/appointment/public")
            .get(this.AppointmentController.getAllAppointment)
            .post(this.AppointmentController.createAppointment);

        app.route("/api/appointment/public/:id")
            .get(this.AppointmentController.getAppointmentById)
            .put(this.AppointmentController.updateAppointment)
            .delete(this.AppointmentController.deleteAppointment);

        //Rutas protegidas
        app.route("/api/appointment")
            .get(authMiddleware, this.AppointmentController.getAllAppointment)
            .post(authMiddleware, this.AppointmentController.createAppointment);

        app.route("/api/appointment/:id")
            .get(authMiddleware, this.AppointmentController.getAppointmentById)
            .put(authMiddleware, this.AppointmentController.updateAppointment)
            .delete(authMiddleware, this.AppointmentController.deleteAppointment);

    }
}