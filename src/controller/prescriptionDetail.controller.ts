import { Request, Response } from 'express';
import { PrescriptionDetailI, PrescriptionDetail } from '../models/prescriptiondetail';

export class PrescriptionDetailController {
    public async getAllPrescriptionDetails(req: Request, res: Response) {
        try {
            const prescriptionDetails = await PrescriptionDetail.findAll(
                { where: { status: "ACTIVE" } }
            );
            res.status(200).json(prescriptionDetails);
        } catch (error) {
            res.status(500).json({ error: 'Error al mostrar detalles de receta' });
        }
    }

    public async getPrescriptionDetailById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const prescriptionDetail = await PrescriptionDetail.findOne({
                where: { id, status: "ACTIVE" }
            });
            if (!prescriptionDetail) {
                return res.status(404).json({ error: 'Detalle de receta no encontrado' });
            }
            res.status(200).json(prescriptionDetail);
        } catch (error) {
            res.status(500).json({ error: 'Error al mostrar detalle de receta' });
        }
    }

    public async createPrescriptionDetail(req: Request, res: Response) {
        const { body } = req;
        try {
            const prescriptionDetail = await PrescriptionDetail.create({
                ...body,
                status: "ACTIVE"
            });
            res.status(201).json(prescriptionDetail);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear detalle de receta' });
        }
    }

    public async updatePrescriptionDetail(req: Request, res: Response) {
        const { id } = req.params;
        const { body } = req;
        try {
            const prescriptionDetail = await PrescriptionDetail.findOne({
                where: { id, status: "ACTIVE" }
            });
            if (!prescriptionDetail) {
                return res.status(404).json({ error: 'Detalle de receta no encontrado' });
            }
            await PrescriptionDetail.update(body, { where: { id } });
            const updated = await PrescriptionDetail.findOne({ where: { id } });
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar detalle de receta' });
        }
    }

    public async deletePrescriptionDetail(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const prescriptionDetail = await PrescriptionDetail.findOne({
                where: { id, status: "ACTIVE" }
            });
            if (!prescriptionDetail) {
                return res.status(404).json({ error: 'Detalle de receta no encontrado' });
            }
            await PrescriptionDetail.update({ status: "INACTIVE" }, { where: { id } });
            res.status(200).json({ message: 'Detalle de receta eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar detalle de receta' });
        }
    }
}