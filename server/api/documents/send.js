import { defineEventHandler, readBody } from "h3";
import Document from "../../models/Document.js";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

export default defineEventHandler(async (event) => {
  // Cek API Key
  await apiKeyAuth(event);

  // Ambil documentId dari body
  const { documentId } = await readBody(event);

  // Cari document berdasarkan documentId
  const document = await Document.findByPk(documentId);
  if (!document)
    throw createError({ statusCode: 404, message: "Dokumen tidak ditemukan" });

  // Tambahkan properti fileUrl ke objek document
  const fileUrl = `/uploads/${document.filename}`;

  return {
    message: "Dokumen dikirim ke TTE",
    document: { ...document.toJSON(), fileUrl },
  };
});
