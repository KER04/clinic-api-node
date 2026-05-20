import { Application } from "express";
import { PaymentController } from "../controller/payment.controller";
import { authMiddleware } from "../middleware/auth";

export class PaymentRoutes {
    public paymentController: PaymentController = new PaymentController;

    public routes(app: Application): void {
        app.route("/api/payment/public")
            .get(this.paymentController.getAllPayment)
            .post(this.paymentController.createPayment);

        app.route("/api/payment/public/:id")
            .get(this.paymentController.getPaymentById)
            .put(this.paymentController.updatePayment)
            .delete(this.paymentController.deletePayment);

        // Rutas protegidas
        app.route("/api/payment")
            .get(authMiddleware, this.paymentController.getAllPayment)
            .post(authMiddleware, this.paymentController.createPayment);

        app.route("/api/payment/:id")
            .get(authMiddleware, this.paymentController.getPaymentById)
            .put(authMiddleware, this.paymentController.updatePayment)
            .delete(authMiddleware, this.paymentController.deletePayment);
    }
}