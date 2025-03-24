import { DataTypes } from "sequelize";
import db from "../database/database.js";

const User = db.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nip: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

export default User;
