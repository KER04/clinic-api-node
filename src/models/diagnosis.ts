import { DataTypes, Model } from "sequelize";
import  sequelize  from "../database/db";

//diagnostico
export interface DiagnosisI {
  id?: number;
  patient_id: number;
  appointment_id: number;
  icd10_code?: string;
  description: string;
  diagnosis_date: Date;
  observations?: string;
  status: "ACTIVE" | "INACTIVE";
}

export class Diagnosis extends Model {
  
  public id!: number;
  public patient_id!: number;
  public appointment_id!: number;
  public icd10_code?: string;
  public description!: string;
  public diagnosis_date!: Date;
  public observations?: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Diagnosis.init(
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
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'appointments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Si se borra la cita, se borra el diagnóstico
    },
    icd10_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: { args: [3, 10], msg: "El código CIE-10 debe tener entre 3 y 10 caracteres" }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La descripción no puede estar vacía" }
      }
    },
    diagnosis_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        //isDate: { msg: "Debe ser una fecha válida" }
      }
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    }
  },
  {
    sequelize,
    modelName: "Diagnosis",
    tableName: "diagnoses",
    timestamps: false,
  }
);