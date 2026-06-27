import { Request, Response } from 'express';
import { ProcedureI, Procedure } from '../models/procedure';

export class ProcedureController {
  // Obtener todos los procedimientos activos (público)
  public async getAllProcedures(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const offset = (page - 1) * limit;

      const { count, rows } = await Procedure.findAndCountAll({
        where: { status: "ACTIVE" },
        limit,
        offset,
      });

      res.status(200).json({
        data: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      res.status(500).json({ error: "Error al mostrar procedimientos" });
    }
  }

  // Obtener procedimiento por ID
  public async getProcedureById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const procedure = await Procedure.findByPk(id);
      if (!procedure) {
        return res.status(404).json({ error: "Procedimiento no encontrado" });
      }
      res.status(200).json(procedure);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener procedimiento" });
    }
  }

  // Crear nuevo procedimiento
  public async createProcedure(req: Request, res: Response) {
    try {
      const {
        appointment_id,
        procedure_code,
        procedure_name,
        description,
        cost,
        performed_date,
        status,
      } = req.body;

      const newProcedure = await Procedure.create({
        appointment_id,
        procedure_code,
        procedure_name,
        description,
        cost,
        performed_date,
        status: status || "ACTIVE",
      });

      res.status(201).json({
        message: "Procedimiento creado exitosamente",
        procedure: newProcedure,
      });
    } catch (error) {
      console.error("Error al crear procedimiento:", error);
      res.status(500).json({ error: "Error al crear procedimiento" });
    }
  }

  // Actualizar procedimiento existente
  public async updateProcedure(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        appointment_id,
        procedure_code,
        procedure_name,
        description,
        cost,
        performed_date,
        status,
      } = req.body;

      const procedure = await Procedure.findByPk(id);
      if (!procedure) {
        return res.status(404).json({ error: "Procedimiento no encontrado" });
      }

      await procedure.update({
        appointment_id,
        procedure_code,
        procedure_name,
        description,
        cost,
        performed_date,
        status,
      });

      res.status(200).json({
        message: "Procedimiento actualizado exitosamente",
        procedure,
      });
    } catch (error) {
      console.error("Error al actualizar procedimiento:", error);
      res.status(500).json({ error: "Error al actualizar procedimiento" });
    }
  }

  // Eliminar (cambiar estado a INACTIVE)
  public async deleteProcedure(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const procedure = await Procedure.findByPk(id);
      if (!procedure) {
        return res.status(404).json({ error: "Procedimiento no encontrado" });
      }

      await procedure.update({ status: "INACTIVE" });
      res.status(200).json({ message: "Procedimiento eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar procedimiento:", error);
      res.status(500).json({ error: "Error al eliminar procedimiento" });
    }
  }
}