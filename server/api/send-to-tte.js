import { defineEventHandler } from "h3";
import Document from "../models/Document.js";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  // Ambil ID dokumen dari parameter URL
  const { documentId } = event.context.params;
  const document = await Document.findByPk(documentId);

  // Cek apakah dokumen ditemukan
  if (!document) return { error: "Dokumen tidak ditemukan" };

  // Cek apakah file dokumen ada
  const filePath = path.resolve("./uploads", document.filename);
  if (!fs.existsSync(filePath)) return { error: "File tidak ditemukan" };

  return sendRedirect(event, `/storage/${document.filename}`);
});
