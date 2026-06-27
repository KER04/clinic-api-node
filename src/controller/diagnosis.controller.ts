import { DiagnosisI, Diagnosis } from "../models/diagnosis";
import { Request, Response } from "express";

export class DiagnosisController {
    public async getAllDiagnosis(req: Request, res: Response) {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
            const offset = (page - 1) * limit;

            const { count, rows } = await Diagnosis.findAndCountAll({
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
            res.status(500).json({ error: "Error al mostrar diagnosticos" });
        }
    }

    public async getDiagnosisById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const diagnosis: DiagnosisI | null = await Diagnosis.findOne({
                where: { id, status: "ACTIVE" }
            });
            if (!diagnosis) {
                return res.status(404).json({ error: 'Diagnostico no encontrado' });
            }
            res.status(200).json({ diagnosis });
        } catch (error) {
            res.status(500).json({ error: 'Error al mostrar diagnostico' });
        }
    }

    public async createDiagnosis(req: Request, res: Response) {
        const { body } = req;
        try {
            const diagnosis: DiagnosisI = await Diagnosis.create({
                ...body,
                status: "ACTIVE"
            });
            res.status(201).json({ diagnosis });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear diagnostico' });
        }
    }

    public async updateDiagnosis(req: Request, res: Response) {
        const { id } = req.params;
        const { body } = req;
        try {
            const diagnosis: DiagnosisI | null = await Diagnosis.findOne({
                where: { id, status: "ACTIVE" }
            });
            if (!diagnosis) {
                return res.status(404).json({ error: 'Diagnostico no encontrado' });
            }
            await Diagnosis.update(body, { where: { id } });
            const updated: DiagnosisI | null = await Diagnosis.findOne({ where: { id } });
            res.status(200).json({ diagnosis: updated });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar diagnostico' });
        }
    }

    public async deleteDiagnosis(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const diagnosis: DiagnosisI | null = await Diagnosis.findOne({
                where: { id, status: "ACTIVE" }
            });
            if (!diagnosis) {
                return res.status(404).json({ error: 'Diagnostico no encontrado' });
            }
            await Diagnosis.update({ status: "INACTIVE" }, { where: { id } });
            res.status(200).json({ message: 'Diagnostico eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar diagnostico' });
        }
    }

}