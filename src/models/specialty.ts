import { DataTypes, Model } from "sequelize";
import  sequelize  from "../database/db";

//especialidad
export interface SpecialtyI {
  id?: number;
  specialty_name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
}

export class Specialty extends Model {
  //el ! indica que no permite valores nulos
  public id!: number;
  public specialty_name!: string;
  public description?: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Specialty.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    specialty_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre de la especialidad no puede estar vacío" },
        len: { args: [3, 100], msg: "El nombre de la especialidad debe tener entre 3 y 100 caracteres" }
      }
    },
    description: {
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
    modelName: "Specialty",
    tableName: "specialties",
    timestamps: false,
  }
);