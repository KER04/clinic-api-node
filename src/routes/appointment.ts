import { Application } from "express";
import { AppointmentController } from "../controller/appointment.controller";
import { authMiddleware } from "../middleware/auth";

export class AppointmentRoutes {
    
    public AppointmentController: AppointmentController = new AppointmentController;

    public routes(app: Application): void{
        app.route("/api/appointment/public").get(this.AppointmentController.getAllAppointment);
        app.route("/api/appointment/public/:id").get(this.AppointmentController.getAppointmentById);
        app.route("/api/appointment/public").post(this.AppointmentController.createAppointment);
        app.route("/api/appointment/public/:id").put(this.AppointmentController.updateAppointment);
        app.route("/api/appointment/public/:id").delete(this.AppointmentController.deleteAppointment);
        
        //Rutas protegidas
        app.route("/api/appointment").get(authMiddleware, this.AppointmentController.getAllAppointment);
        
    }
}