import { DataTypes } from "sequelize";
import db from "../database/database.js";

const Application = db.define(
  "Application",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    apiKey: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

export default Application;
