import { z } from "zod";

// Reutilizables
// En create: si no envían status, queda "ACTIVE" (satisface las validaciones manuales de los controladores).
// En update (.partial()) el campo es opcional y NO se fuerza el default si viene ausente.
const status = z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE");
const id = (msg: string) => z.coerce.number({ message: msg }).int().positive(msg);
const money = (msg: string) => z.coerce.number({ message: msg }).min(0, msg);
// Valida que sea una fecha parseable PERO conserva el string original (evita el corrimiento
// de día por zona horaria que provoca convertir a Date en una columna DATEONLY).
const dateStr = (msg: string) => z.string().refine((v) => !Number.isNaN(Date.parse(v)), msg);

// ===================== Patient =====================
export const createPatientSchema = z.object({
  first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres").max(100),
  document: z.string().min(1, "El documento es obligatorio").max(20),
  birth_date: dateStr("La fecha de nacimiento no es válida"),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 dígitos").max(15).optional(),
  email: z.string().email("El email no es válido").optional(),
  address: z.string().optional(),
  gender: z.enum(["M", "F"]),
  status,
});
export const updatePatientSchema = createPatientSchema.partial();

// ===================== Doctor =====================
export const createDoctorSchema = z.object({
  first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres").max(100),
  document: z.string().min(1, "El documento es obligatorio").max(20),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 dígitos").max(15).optional(),
  email: z.string().email("El email no es válido").optional(),
  medical_license: z.string().min(1, "La matrícula médica es obligatoria").max(50),
  specialty_id: id("La especialidad es obligatoria"),
  status,
});
export const updateDoctorSchema = createDoctorSchema.partial();

// ===================== Specialty =====================
export const createSpecialtySchema = z.object({
  specialty_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  description: z.string().optional(),
  status,
});
export const updateSpecialtySchema = createSpecialtySchema.partial();

// ===================== Medicine =====================
export const createMedicineSchema = z.object({
  commercial_name: z.string().min(2, "El nombre comercial debe tener al menos 2 caracteres").max(100),
  generic_name: z.string().min(2, "El nombre genérico debe tener al menos 2 caracteres").max(100),
  concentration: z.string().min(1, "La concentración es obligatoria").max(50),
  pharmaceutical_form: z.string().min(1, "La forma farmacéutica es obligatoria").max(50),
  laboratory: z.string().optional(),
  unit_price: money("El precio debe ser un número mayor o igual a 0"),
  status,
});
export const updateMedicineSchema = createMedicineSchema.partial();

// ===================== Appointment =====================
export const createAppointmentSchema = z.object({
  patient_id: id("El paciente es obligatorio"),
  doctor_id: id("El doctor es obligatorio"),
  appointment_datetime: dateStr("La fecha/hora de la cita no es válida"),
  consultation_reason: z.string().max(500).optional(),
  status,
  observations: z.string().optional(),
});
export const updateAppointmentSchema = createAppointmentSchema.partial();

// ===================== Diagnosis =====================
export const createDiagnosisSchema = z.object({
  patient_id: id("El paciente es obligatorio"),
  appointment_id: id("La cita es obligatoria"),
  icd10_code: z.string().min(3).max(10).optional(),
  description: z.string().min(1, "La descripción es obligatoria"),
  diagnosis_date: dateStr("La fecha del diagnóstico no es válida"),
  observations: z.string().optional(),
  status,
});
export const updateDiagnosisSchema = createDiagnosisSchema.partial();

// ===================== Prescription =====================
export const createPrescriptionSchema = z.object({
  appointment_id: id("La cita es obligatoria"),
  doctor_id: id("El doctor es obligatorio"),
  issue_date: dateStr("La fecha de emisión no es válida"),
  general_instructions: z.string().optional(),
  status,
});
export const updatePrescriptionSchema = createPrescriptionSchema.partial();

// ===================== PrescriptionDetail =====================
export const createPrescriptionDetailSchema = z.object({
  prescription_id: id("La receta es obligatoria"),
  medicine_id: id("El medicamento es obligatorio"),
  quantity: z.coerce.number({ message: "La cantidad debe ser un número" }).int().min(1, "La cantidad debe ser al menos 1"),
  dosage: z.string().min(3, "La dosis debe tener al menos 3 caracteres").max(200),
  treatment_days: z.coerce.number({ message: "Los días de tratamiento deben ser un número" }).int().min(1, "Mínimo 1 día").max(365, "Máximo 365 días"),
  special_instructions: z.string().optional(),
  status,
});
export const updatePrescriptionDetailSchema = createPrescriptionDetailSchema.partial();

// ===================== Procedure =====================
export const createProcedureSchema = z.object({
  appointment_id: id("La cita es obligatoria"),
  procedure_code: z.string().max(20).optional(),
  procedure_name: z.string().min(3, "El nombre del procedimiento debe tener al menos 3 caracteres").max(200),
  description: z.string().optional(),
  cost: money("El costo debe ser un número mayor o igual a 0"),
  performed_date: dateStr("La fecha del procedimiento no es válida"),
  status,
});
export const updateProcedureSchema = createProcedureSchema.partial();

// ===================== Payment =====================
export const createPaymentSchema = z.object({
  appointment_id: id("La cita es obligatoria"),
  total_amount: money("El monto total debe ser un número mayor o igual a 0"),
  consultation_amount: money("El monto de consulta debe ser un número mayor o igual a 0"),
  procedures_amount: money("El monto de procedimientos debe ser un número mayor o igual a 0").optional(),
  payment_method: z.enum(["EFECTIVO", "TARJETA", "TRANSFERENCIA"]),
  payment_date: dateStr("La fecha de pago no es válida"),
  payment_status: z.enum(["PENDIENTE", "COMPLETADO", "FALLIDO"]).optional(),
  invoice_number: z.string().max(50).optional(),
  status,
});
export const updatePaymentSchema = createPaymentSchema.partial();
