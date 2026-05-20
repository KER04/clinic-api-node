import { DataTypes, Model, Optional } from "sequelize";
import  sequelize  from "../database/db";
//detalle - receta
export interface PrescriptionDetailI {
  id?: number;
  prescription_id: number;
  medicine_id: number;
  quantity: number;
  dosage: string;
  treatment_days: number;
  special_instructions?: string;
  status: "ACTIVE" | "INACTIVE"; 
}

export class PrescriptionDetail extends Model{
  
  public id!: number;
  public prescription_id!: number; 
  public medicine_id!: number; 
  public quantity!: number;
  public dosage!: string;
  public treatment_days!: number;
  public special_instructions?: string;
}

PrescriptionDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    prescription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'prescriptions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Si se borra la receta, se borran sus detalles
    },
    medicine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'medicines',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT' // No se puede borrar un medicamento con detalles de receta
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: "La cantidad debe ser al menos 1" },
        isInt: { msg: "La cantidad debe ser un número entero" }
      }
    },
    dosage: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "La dosis no puede estar vacía" },
        len: { args: [3, 200], msg: "La dosis debe tener entre 3 y 200 caracteres" }
      }
    },
    treatment_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: "Los días de tratamiento deben ser al menos 1" },
        max: { args: [365], msg: "Los días de tratamiento no pueden exceder 365" },
        isInt: { msg: "Los días de tratamiento deben ser un número entero" }
      }
    },
    special_instructions: {
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
    modelName: "PrescriptionDetail",
    tableName: "prescription_details",
    timestamps: false,
  }
);