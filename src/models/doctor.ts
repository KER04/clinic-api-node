import { DataTypes, Model, Optional } from "sequelize";
import  sequelize  from "../database/db";
import { Specialty } from "./specialty";

//medico
export interface DoctorI {
  id?: number;
  first_name: string;
  last_name: string;
  document: string;
  phone?: string;
  email?: string;
  medical_license: string;
  specialty_id: number;
  status: "ACTIVE" | "INACTIVE"; 
}

export class Doctor extends Model {

  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public document!: string;
  public phone?: string;
  public email?: string;
  public medical_license!: string;
  public specialty_id!: number;
  public status!: "ACTIVE" | "INACTIVE"; 
}

Doctor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" },
        len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres" }
      }
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El apellido no puede estar vacío" },
        len: { args: [2, 100], msg: "El apellido debe tener entre 2 y 100 caracteres" }
      }
    },
    document: { // ⚠️ Corregido: era "document_id" pero en la interface es "document"
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El documento no puede estar vacío" }
      }
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        len: { args: [7, 15], msg: "El teléfono debe tener entre 7 y 15 dígitos" }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: { msg: "Debe ser un email válido" }
      }
    },
    medical_license: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "La matrícula médica no puede estar vacía" }
      }
    },
    specialty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'specialties', 
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT' // No se puede borrar una especialidad si tiene doctores
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Doctor",
    tableName: "doctors",
    timestamps: false,
  }
);
