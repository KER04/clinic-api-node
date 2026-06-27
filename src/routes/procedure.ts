import { Application } from "express";
import { ProcedureController } from "../controller/procedure.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createProcedureSchema, updateProcedureSchema } from "../schemas/entities.schema";

export class ProcedureRoutes {
    public procedureController: ProcedureController = new ProcedureController();

    public routes(app: Application): void {
        app.route("/api/procedure/public")
            .get(this.procedureController.getAllProcedures)
            .post(validate(createProcedureSchema), this.procedureController.createProcedure);

        app.route("/api/procedure/public/:id")
            .get(this.procedureController.getProcedureById)
            .put(validate(updateProcedureSchema), this.procedureController.updateProcedure)
            .delete(this.procedureController.deleteProcedure);

        // Rutas que requieren autenticación
        app.route("/api/procedure")
            .get(authMiddleware, this.procedureController.getAllProcedures)
            .post(authMiddleware, validate(createProcedureSchema), this.procedureController.createProcedure);

        app.route("/api/procedure/:id")
            .get(authMiddleware, this.procedureController.getProcedureById)
            .put(authMiddleware, validate(updateProcedureSchema), this.procedureController.updateProcedure)
            .delete(authMiddleware, this.procedureController.deleteProcedure);
    }
}