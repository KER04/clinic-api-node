import { PatientI, Patient } from "../models/patient";
import { Request, Response } from "express";

export class PatientController {
    // Obtener todos los pacientes activos
    public async getAllPatients(req: Request, res: Response) {
        try {
            const patients: PatientI[] = await Patient.findAll({
                where: { status: "ACTIVE" },
            });
            res.status(200).json({ patients });
        } catch (error) {
            console.error("Error al obtener pacientes:", error);
            res.status(500).json({ error: "Error al mostrar pacientes" });
        }

    }


    // Obtener paciente por ID
    public async getPatientById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const patient: PatientI | null = await Patient.findByPk(id);
            if (patient) {
                res.status(200).json({ patient });
            } else {
                res.status(404).json({ error: "Paciente no encontrado" });
            }
        } catch (error) {
            console.error("Error al obtener paciente por ID:", error);
            res.status(500).json({ error: "Error al mostrar paciente" });
        }
    }


    // crear nuevo paciente

    public async createPatient(req: Request, res: Response) {
        try {
            const {
                first_name,
                last_name,
                document,
                birth_date,
                phone,
                email,
                address,
                gender,
                status,
            } = req.body;

            // Validación de campos obligatorios
            if (!first_name || !last_name || !document || !birth_date || !gender || !status) {
                return res.status(400).json({
                    error: "Faltan campos obligatorios",
                });
            }

            // Crear paciente
            const newPatient = await Patient.create({
                first_name,
                last_name,
                document,
                birth_date,
                phone,
                email,
                address,
                gender,
                status,
            });

            res.status(201).json({
                message: "Paciente creado exitosamente",
                patient: newPatient,
            });

        } catch (error: any) {
            console.error("❌ Error al crear paciente:", error);
            res.status(500).json({
                error: "Error al crear paciente",
                details: error.message,
            });
        }
    }

    // update paciente
    public async updatePatient(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const {
                first_name,
                last_name,
                document,
                birth_date,
                phone,
                email,
                address,
                gender,
                status,
            } = req.body;
            const patient = await Patient.findByPk(id);
            if (!patient) {
                return res.status(404).json({ error: "Paciente no encontrado" });
            }
            await patient.update({
                first_name,
                last_name,
                document,
                birth_date,
                phone,
                email,
                address,
                gender,
                status,
            });
            res.status(200).json({
                message: "Paciente actualizado exitosamente",
                patient,
            });
        } catch (error: any) {
            console.error("❌ Error al actualizar paciente:", error);
            res.status(500).json({
                error: "Error al actualizar paciente",
                details: error.message,
            });
        }
    }

    // delete paciente
    // ✅ Eliminar paciente (marcar como INACTIVE)
    public async deletePatient(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const patient = await Patient.findByPk(id);
            if (!patient) {
                return res.status(404).json({
                    error: "Paciente no encontrado",
                });
            }

            await patient.update({ status: "INACTIVE" });

            res.status(200).json({
                message: "Paciente eliminado correctamente",
            });

        } catch (error) {
            console.error("Error al eliminar paciente:", error);

            res.status(500).json({
                error: "Error al eliminar paciente",
            });
        }
    }



}