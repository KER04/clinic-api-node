import { MedicineI, Medicine } from "../models/medicine";
import { Request, Response } from "express";

export class MedicineController {
public async getAllMedicine(req: Request, res: Response) {
    try {
        const medicine: MedicineI[] = await Medicine.findAll(
            { where: { status: "ACTIVE" } }
        );
        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar medicamentos' });
    }
}

public async getMedicineById(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const medicine: MedicineI | null = await Medicine.findOne({
            where: { id, status: "ACTIVE" }
        });
        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar medicamento' });
    }
}

public async createMedicine(req: Request, res: Response) {
    const { body } = req;
    try {
        const medicine: MedicineI = await Medicine.create({
            ...body,
            status: "ACTIVE"
        });
        res.status(201).json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear medicamento' });
    }
}

public async updateMedicine(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    try {
        const medicine: MedicineI | null = await Medicine.findOne({
            where: { id, status: "ACTIVE" }
        });
        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        await Medicine.update(body, { where: { id } });
        const updated: MedicineI | null = await Medicine.findOne({ where: { id } });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar medicamento' });
    }
}

public async deleteMedicine(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const medicine: MedicineI | null = await Medicine.findOne({
            where: { id, status: "ACTIVE" }
        });
        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        await Medicine.update({ status: "INACTIVE" }, { where: { id } });
        res.status(200).json({ message: 'Medicamento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar medicamento' });
    }
}
}