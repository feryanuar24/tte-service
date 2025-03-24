import { defineEventHandler, getQuery } from "h3";
import Document from "../../models/Document";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

export default defineEventHandler(async (event) => {
  // Cek API Key
  await apiKeyAuth(event);

  // Ambil documentId dari body
  const { documentId } = await readBody(event);
  if (!documentId)
    throw createError({ statusCode: 400, message: "ID dokumen diperlukan" });

  // Cari document berdasarkan documentId
  const document = await Document.findByPk(documentId, {
    include: [
      { model: User, attributes: ["name"] },
      { model: Application, attributes: ["name"] },
    ],
  });
  if (!document)
    throw createError({
      statusCode: 404,
      message: "Dokumen yang ditandatangani tidak ditemukan",
    });

  return {
    message: "Dokumen yang ditandatangani berhasil diambil",
    data: {
      fileUrl: `/uploads/signed/${document.filename}`,
      applicationName: document.Application.name,
      userName: document.User.name,
      filename: document.filename,
      status: document.status,
    },
  };
});
