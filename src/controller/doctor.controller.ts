import { Doctor, DoctorI } from "../models/doctor";
import { Request, Response } from "express";


export class DoctorController {
    // ✅ Obtener todos los doctores activos (público)
    public async getAllDoctor(req: Request, res: Response) {
        try {
            const doctors: DoctorI[] = await Doctor.findAll({
                where: { status: "ACTIVE" },
            });
            res.status(200).json(doctors);
        } catch (error) {
            console.error("Error al obtener doctores:", error);
            res.status(500).json({ error: "Error al mostrar doctores" });
        }
    }

    // ✅ Obtener un doctor por ID (público)
    public async getDoctorById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doctor = await Doctor.findByPk(id);
            if (!doctor) {
                return res.status(404).json({ error: "Doctor no encontrado" });
            }
            res.status(200).json(doctor);
        } catch (error) {
            console.error("Error al obtener doctor:", error);
            res.status(500).json({ error: "Error al obtener doctor" });
        }
    }

    // ✅ Crear un nuevo doctor (privado)
    public async createDoctor(req: Request, res: Response) {
        try {
            const {
                first_name,
                last_name,
                document,
                phone,
                email,
                medical_license,
                specialty_id,
                status,
            } = req.body;

            // Validación simple
            if (!first_name || !last_name || !document || !medical_license || !specialty_id) {
                return res.status(400).json({ error: "Faltan campos obligatorios" });
            }

            const newDoctor = await Doctor.create({
                first_name,
                last_name,
                document,
                phone,
                email,
                medical_license,
                specialty_id,
                status,
            });

            res.status(201).json({
                message: "Doctor creado exitosamente",
                doctor: newDoctor,
            });
        } catch (error: any) {
            console.error("❌ Error al crear doctor:", error);
            res.status(500).json({
                error: "Error al crear doctor",
                details: error.message,
            });
        }
    }
    // ✅ Actualizar doctor existente (privado)
    public async updateDoctor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const {
                first_name,
                last_name,
                document,
                phone,
                email,
                medical_license,
                specialty_id,
                status,
            } = req.body;

            const doctor = await Doctor.findByPk(id);
            if (!doctor) {
                return res.status(404).json({ error: "Doctor no encontrado" });
            }

            await doctor.update({
                first_name,
                last_name,
                document,
                phone,
                email,
                medical_license,
                specialty_id,
                status,
            });

            res.status(200).json({
                message: "Doctor actualizado exitosamente",
                doctor,
            });
        } catch (error) {
            console.error("Error al actualizar doctor:", error);
            res.status(500).json({ error: "Error al actualizar doctor" });
        }
    }

    // ✅ Eliminar doctor (marcar como INACTIVE)
    public async deleteDoctor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doctor = await Doctor.findByPk(id);
            if (!doctor) {
                return res.status(404).json({ error: "Doctor no encontrado" });
            }

            await doctor.update({ status: "INACTIVE" });
            res.status(200).json({ message: "Doctor eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar doctor:", error);
            res.status(500).json({ error: "Error al eliminar doctor" });
        }
    }
}
