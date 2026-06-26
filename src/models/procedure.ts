import { DataTypes, Model } from "sequelize";
import  sequelize  from "../database/db";
//procedimiento
export interface ProcedureI {
  id?: number;
  appointment_id: number;
  procedure_code?: string;
  procedure_name: string;
  description?: string;
  cost: number;
  performed_date: Date;
  status: "ACTIVE" | "INACTIVE"; 
}

export class Procedure extends Model {
  
  public id!: number;
  public appointment_id!: number; 
  public procedure_code?: string;
  public procedure_name!: string;
  public description?: string;
  public cost!: number;
  public performed_date!: Date;
  public status!: "ACTIVE" | "INACTIVE"; 
}

Procedure.init(
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
      onDelete: 'CASCADE' // Si se borra la cita, se borran sus procedimientos
    },
    procedure_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    procedure_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre del procedimiento no puede estar vacío" },
        len: { args: [3, 200], msg: "El nombre del procedimiento debe tener entre 3 y 200 caracteres" }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: "El costo debe ser mayor o igual a 0" },
        isDecimal: { msg: "El costo debe ser un número decimal" }
      }
    },
    performed_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        //isDate: { msg: "Debe ser una fecha válida" }
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
    modelName: "Procedure",
    tableName: "procedures",
    timestamps: false,
  }
);