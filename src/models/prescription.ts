import { DataTypes, Model } from "sequelize";
import  sequelize  from "../database/db";

//receta
export interface PrescriptionI {
  id?: number;
  appointment_id: number;
  doctor_id: number;
  issue_date: Date;
  general_instructions?: string;
  status: "ACTIVE" | "INACTIVE"; 
}

export class Prescription extends Model {
  
  public id!: number;
  public appointment_id!: number; 
  public doctor_id!: number;
  public issue_date!: Date;
  public general_instructions?: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Prescription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'appointments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Si se borra la cita, se borran sus recetas
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT' // No se puede borrar un doctor con recetas emitidas
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        //isDate: { msg: "Debe ser una fecha válida" }
      }
    },
    general_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Prescription",
    tableName: "prescriptions",
    timestamps: false,
  }
);