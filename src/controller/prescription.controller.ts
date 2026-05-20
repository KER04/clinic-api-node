import { PrescriptionI, Prescription } from "../models/prescription";
import { Request, Response } from "express";

export class PrescriptionController {
    public async getAllPrescriptions(req: Request, res: Response) {
        try {
            const prescriptions: PrescriptionI[] = await Prescription.findAll(
                { where: { status: "ACTIVE" } }
            );
            res.status(200).json(prescriptions);
        } catch (error) {
            res.status(500).json({ error: 'Error al mostrar recetas' });
        }
    }

    public async getPrescriptionById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const prescription: PrescriptionI | null = await Prescription.findOne({
                where: { id, status: "ACTIVE" }
            });
            if (!prescription) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }
            res.status(200).json(prescription);
        } catch (error) {
            res.status(500).json({ error: 'Error al mostrar receta' });
        }
    }

    public async createPrescription(req: Request, res: Response) {
        const { body } = req;
        try {
            const prescription: PrescriptionI = await Prescription.create({
                ...body,
                status: "ACTIVE"
            });
            res.status(201).json(prescription);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear receta' });
        }
    }

    public async updatePrescription(req: Request, res: Response) {
        const { id } = req.params;
        const { body } = req;
        try {
            const prescription: PrescriptionI | null = await Prescription.findOne({
                where: { id, status: "ACTIVE" }
            });
            if (!prescription) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }
            await Prescription.update(body, { where: { id } });
            const updated: PrescriptionI | null = await Prescription.findOne({ where: { id } });
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar receta' });
        }
    }

    public async deletePrescription(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const prescription: PrescriptionI | null = await Prescription.findOne({
                where: { id, status: "ACTIVE" }
            });
            if (!prescription) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }
            await Prescription.update({ status: "INACTIVE" }, { where: { id } });
            res.status(200).json({ message: 'Receta eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar receta' });
        }
    }
}