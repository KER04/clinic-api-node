import { Request, Response } from "express";
import { Specialty } from "../models/specialty"; // ajusta la ruta si es diferente

export class SpecialtyController {
  // Obtener todas las especialidades activas
  public async getAllSpecialties(req: Request, res: Response) {
    try {
      const specialties = await Specialty.findAll({                                                       
        //where: { status: "ACTIVE" },
      });
      res.status(200).json({ specialties });
    } catch (error) {
      console.error("Error al obtener especialidades:", error);
      res.status(500).json({ error: "Error al mostrar especialidades" });
    }
  }

  // Obtener una especialidad por ID
  public async getSpecialtyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const specialty = await Specialty.findByPk(id);

      if (!specialty) {
        return res.status(404).json({ error: "Especialidad no encontrada" });
      }

      res.status(200).json({ specialty });
    } catch (error) {
      console.error("Error al obtener la especialidad:", error);
      res.status(500).json({ error: "Error al mostrar la especialidad" });
    }
  }

  // Crear una nueva especialidad
  public async createSpecialty(req: Request, res: Response) {
    try {
      const { specialty_name, description, status } = req.body;

      const newSpecialty = await Specialty.create({
        specialty_name,
        description,
        status: status || "ACTIVE",
      });

      res.status(201).json({ message: "Especialidad creada", newSpecialty });
    } catch (error) {
      console.error("Error al crear la especialidad:", error);
      res.status(500).json({ error: "Error al crear la especialidad" });
    }
  }

  // Actualizar una especialidad existente
  public async updateSpecialty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { specialty_name, description, status } = req.body;

      const specialty = await Specialty.findByPk(id);
      if (!specialty) {
        return res.status(404).json({ error: "Especialidad no encontrada" });
      }

      await specialty.update({
        specialty_name,
        description,
        status,
      });

      res.status(200).json({ message: "Especialidad actualizada", specialty });
    } catch (error) {
      console.error("Error al actualizar la especialidad:", error);
      res.status(500).json({ error: "Error al actualizar la especialidad" });
    }
  }

  // Eliminar (lógicamente) una especialidad (cambia estado a INACTIVE)
  public async deleteSpecialty(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const specialty = await Specialty.findByPk(id);
      if (!specialty) {
        return res.status(404).json({ error: "Especialidad no encontrada" });
      }

      await specialty.update({ status: "INACTIVE" });

      res.status(200).json({ message: "Especialidad eliminada (inactiva)" });
    } catch (error) {
      console.error("Error al eliminar la especialidad:", error);
      res.status(500).json({ error: "Error al eliminar la especialidad" });
    }
  }
}
