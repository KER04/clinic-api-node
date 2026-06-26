import { DataTypes, Model } from "sequelize";
import  sequelize  from "../database/db";

//citas
export interface AppointmentI {
  id?: number;
  patient_id: number;
  doctor_id: number;
  appointment_datetime: Date;
  consultation_reason?: string;
  status: "ACTIVE" | "INACTIVE";
  observations?: string;
}

export class Appointment extends Model {
  
  public id!: number;
  public patient_id!: number;
  public doctor_id!: number;
  public appointment_datetime!: Date;
  public consultation_reason?: string;
  public status!: "ACTIVE" | "INACTIVE";
  public observations?: string;
}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    appointment_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        //isDate: { msg: "Debe ser una fecha y hora válida" }
      }
    },
    consultation_reason: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true, // createdAt / updatedAt para trazabilidad
  }
);