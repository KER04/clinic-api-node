import { PaymentI, Payment } from "../models/payment";
import { Request, Response } from "express";

export class PaymentController{
   public async getAllPayment(req: Request, res: Response) {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
        const offset = (page - 1) * limit;

        const { count, rows } = await Payment.findAndCountAll({
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
        res.status(500).json({ error: 'Error al mostrar pagos' });
    }
}

public async getPaymentById(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const payment: PaymentI | null = await Payment.findOne({
            where: { id, status: "ACTIVE" }
        });
        if (!payment) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar pago' });
    }
}

public async createPayment(req: Request, res: Response) {
    const { body } = req;
    try {
        const payment: PaymentI = await Payment.create({
            ...body,
            status: "ACTIVE"
        });
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear pago' });
    }
}

public async updatePayment(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    try {
        const payment: PaymentI | null = await Payment.findOne({
            where: { id, status: "ACTIVE" }
        });
        if (!payment) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
        await Payment.update(body, { where: { id } });
        const updated: PaymentI | null = await Payment.findOne({ where: { id } });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar pago' });
    }
}

public async deletePayment(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const payment: PaymentI | null = await Payment.findOne({
            where: { id, status: "ACTIVE" }
        });
        if (!payment) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
        await Payment.update({ status: "INACTIVE" }, { where: { id } });
        res.status(200).json({ message: 'Pago eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar pago' });
    }
}
}