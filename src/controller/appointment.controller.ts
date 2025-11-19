import { AppointmentI, Appointment } from "../models/appointment";
import { Request, Response } from "express";

//mostrar que tengan estado activo 
export class AppointmentController {
    public async getAllAppointment(req: Request, res: Response) {
        try {

            const appointment: AppointmentI[] = await Appointment.findAll({
                //where: { status: "ACTIVE" },
            });
            res.status(200).json({ appointment });

        } catch (error) {
            res.status(200).json({ error: "error al mostrar citas" });
        }
    }



 // ============================================
    // ✅ Obtener cita por ID (público)
    // ============================================
    public async getAppointmentById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const appointment = await Appointment.findByPk(id);
            if (!appointment) {
                return res.status(404).json({ error: "Cita no encontrada" });
            }

            res.status(200).json(appointment);

        } catch (error) {
            console.error("Error al obtener cita:", error);
            res.status(500).json({ error: "Error al obtener cita" });
        }
    }

    // ============================================
    // ✅ Crear nueva cita (privado)
    // ============================================
    public async createAppointment(req: Request, res: Response) {
        try {
            const {
                patient_id,
                doctor_id,
                appointment_datetime,
                consultation_reason,
                status,
                observations,
            } = req.body;

            // Validación simple
            if (!patient_id || !doctor_id || !appointment_datetime || !status) {
                return res.status(400).json({ error: "Faltan campos obligatorios" });
            }

            const newAppointment = await Appointment.create({
                patient_id,
                doctor_id,
                appointment_datetime,
                consultation_reason,
                status,
                observations,
            });

            res.status(201).json({
                message: "Cita creada exitosamente",
                appointment: newAppointment,
            });

        } catch (error: any) {
            console.error("❌ Error al crear cita:", error);
            res.status(500).json({
                error: "Error al crear cita",
                details: error.message,
            });
        }
    }

    // ============================================
    // ✅ Actualizar cita existente (privado)
    // ============================================
    public async updateAppointment(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const {
                patient_id,
                doctor_id,
                appointment_datetime,
                consultation_reason,
                status,
                observations,
            } = req.body;

            const appointment = await Appointment.findByPk(id);
            if (!appointment) {
                return res.status(404).json({ error: "Cita no encontrada" });
            }

            await appointment.update({
                patient_id,
                doctor_id,
                appointment_datetime,
                consultation_reason,
                status,
                observations,
            });

            res.status(200).json({
                message: "Cita actualizada exitosamente",
                appointment,
            });

        } catch (error) {
            console.error("Error al actualizar cita:", error);
            res.status(500).json({ error: "Error al actualizar cita" });
        }
    }
    // ✅ Cancelar cita (marcar como INACTIVE)
    public async deleteAppointment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const appointment = await Appointment.findByPk(id);
            
            if (!appointment) {
                return res.status(404).json({ error: "Cita no encontrada" });
            }

            await appointment.update({ status: "INACTIVE" });
            res.status(200).json({ 
                message: "Cita cancelada correctamente",
                appointment 
            });
        } catch (error) {
            console.error("Error al cancelar cita:", error);
            res.status(500).json({ error: "Error al cancelar cita" });
        }
    }

}

export default new AppointmentController();

