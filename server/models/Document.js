import { DataTypes } from "sequelize";
import db from "../database/database.js";
import User from "./User.js";
import Application from "./Application.js";

const Document = db.define(
  "Document",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Application, key: "id" },
    },
    filename: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "signed"),
      defaultValue: "pending",
    },
  },
  { timestamps: true }
);

Document.belongsTo(User, { foreignKey: "userId" });
Document.belongsTo(Application, { foreignKey: "applicationId" });

export default Document;
