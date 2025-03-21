import { defineEventHandler } from "h3";
import Document from "../models/Document";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  // Ambil ID dokumen dari parameter URL
  const { documentId } = event.context.params;
  const document = await Document.findByPk(documentId);

  // Cek apakah dokumen ditemukan
  if (!document || document.status !== "signed")
    return { error: "Dokumen yang ditandatangani tidak ditemukan" };

  // Cek apakah file dokumen ada
  const filePath = path.resolve("./signed-docs", document.filename);
  if (!fs.existsSync(filePath)) return { error: "File not found" };

  return sendRedirect(event, `/signed-storage/${document.filename}`);
});
