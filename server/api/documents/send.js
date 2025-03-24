import { defineEventHandler, readBody } from "h3";
import Document from "../../models/Document.js";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

export default defineEventHandler(async (event) => {
  // Cek API Key
  await apiKeyAuth(event);

  // Ambil documentId dari body
  const { documentId } = await readBody(event);

  // Cari document berdasarkan documentId
  const document = await Document.findByPk(documentId, {
    include: [
      { model: User, attributes: ["name"] },
      { model: Application, attributes: ["name"] },
    ],
  });
  if (!document)
    throw createError({ statusCode: 404, message: "Dokumen tidak ditemukan" });

  return {
    message: "Dokumen dikirim ke TTE",
    data: {
      fileUrl: `/uploads/${document.filename}`,
      applicationName: document.Application.name,
      userName: document.User.name,
      filename: document.filename,
      status: document.status,
    },
  };
});
