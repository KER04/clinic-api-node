import { DataTypes, Model } from "sequelize";
import  sequelize  from "../database/db";
//pagos
export interface PaymentI {
  id?: number;
  appointment_id: number;
  total_amount: number;
  consultation_amount: number;
  procedures_amount: number;
  payment_method: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
  payment_date: Date;
  payment_status: "PENDIENTE" | "COMPLETADO" | "FALLIDO";
  invoice_number?: string;
  status: "ACTIVE" | "INACTIVE";
}

export class Payment extends Model {
  
  public id!: number;
  public appointment_id!: number;
  public total_amount!: number;
  public consultation_amount!: number;
  public procedures_amount!: number;
  public payment_method!: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
  public payment_date!: Date;
  public payment_status!: "PENDIENTE" | "COMPLETADO" | "FALLIDO";
  public invoice_number?: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Payment.init(
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
      onDelete: 'RESTRICT' // No se puede borrar una cita con pagos registrados
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: "El monto total debe ser mayor o igual a 0" },
        isDecimal: { msg: "El monto total debe ser un número decimal" }
      }
    },
    consultation_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: "El monto de consulta debe ser mayor o igual a 0" },
        isDecimal: { msg: "El monto de consulta debe ser un número decimal" }
      }
    },
    procedures_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: { args: [0], msg: "El monto de procedimientos debe ser mayor o igual a 0" },
        isDecimal: { msg: "El monto de procedimientos debe ser un número decimal" }
      }
    },
    payment_method: {
      type: DataTypes.ENUM("EFECTIVO", "TARJETA", "TRANSFERENCIA"),
      allowNull: false,
      validate: {
        isIn: { args: [["EFECTIVO", "TARJETA", "TRANSFERENCIA"]], msg: "Método de pago inválido" }
      }
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        //isDate: { msg: "Debe ser una fecha válida" }
      }
    },
    payment_status: {
      type: DataTypes.ENUM("PENDIENTE", "COMPLETADO", "FALLIDO"), 
      allowNull: false,
      defaultValue: "PENDIENTE",
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    }
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    timestamps: true, // createdAt / updatedAt para trazabilidad
  }
);