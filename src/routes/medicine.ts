import { Application } from "express";
import { MedicineController } from "../controller/medicine.controller";
import { authMiddleware } from "../middleware/auth";

export class MedicineRoutes {
    public medicineController: MedicineController = new MedicineController;

    public routes(app: Application): void {
        app.route("/api/medicine/public")
            .get(this.medicineController.getAllMedicine)
            .post(this.medicineController.createMedicine);

        app.route("/api/medicine/public/:id")
            .get(this.medicineController.getMedicineById)
            .put(this.medicineController.updateMedicine)
            .delete(this.medicineController.deleteMedicine);

        //Rutas protegidas
        app.route("/api/medicine")
            .get(authMiddleware, this.medicineController.getAllMedicine)
            .post(authMiddleware, this.medicineController.createMedicine);

        app.route("/api/medicine/:id")
            .get(authMiddleware, this.medicineController.getMedicineById)
            .put(authMiddleware, this.medicineController.updateMedicine)
            .delete(authMiddleware, this.medicineController.deleteMedicine);
    }
}