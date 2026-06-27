import { Application } from "express";
import { PaymentController } from "../controller/payment.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createPaymentSchema, updatePaymentSchema } from "../schemas/entities.schema";

export class PaymentRoutes {
    public paymentController: PaymentController = new PaymentController;

    public routes(app: Application): void {
        app.route("/api/payment/public")
            .get(this.paymentController.getAllPayment)
            .post(validate(createPaymentSchema), this.paymentController.createPayment);

        app.route("/api/payment/public/:id")
            .get(this.paymentController.getPaymentById)
            .put(validate(updatePaymentSchema), this.paymentController.updatePayment)
            .delete(this.paymentController.deletePayment);

        // Rutas protegidas
        app.route("/api/payment")
            .get(authMiddleware, this.paymentController.getAllPayment)
            .post(authMiddleware, validate(createPaymentSchema), this.paymentController.createPayment);

        app.route("/api/payment/:id")
            .get(authMiddleware, this.paymentController.getPaymentById)
            .put(authMiddleware, validate(updatePaymentSchema), this.paymentController.updatePayment)
            .delete(authMiddleware, this.paymentController.deletePayment);
    }
}