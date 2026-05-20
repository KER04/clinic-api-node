import { DataTypes, Model } from "sequelize";
import  sequelize  from "../database/db";

//pacientes
export interface PatientI {
  id?: number;
  first_name: string;
  last_name: string;
  document: string;
  birth_date: Date;
  phone?: string;
  email?: string;
  address?: string;
  gender: "M" | "F";
  status: "ACTIVE" | "INACTIVE";
}

export class Patient extends Model {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public document!: string;
  public birth_date!: Date;
  public phone?: string; 
  public email?: string; 
  public address?: string; 
  public gender!: "M" | "F";
  public status!: "ACTIVE" | "INACTIVE";
}

Patient.init(
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
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        //isDate: { msg: "Debe ser una fecha válida" },
        //isBefore: {
          //args: new Date().toISOString().split('T')[0],
          //msg: "La fecha de nacimiento debe ser anterior a hoy"
       // }
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
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("M", "F"), 
      allowNull: false,
      validate: {
        isIn: { args: [["M", "F"]], msg: "El género debe ser M o F" }
      }
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    }
  },
  {
    sequelize,
    modelName: "Patient",
    tableName: "patients",
    timestamps: false,
  }
);