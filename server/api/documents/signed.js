import fs from "fs";
import path from "path";
import { defineEventHandler, readMultipartFormData } from "h3";
import Document from "../../models/Document";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

export default defineEventHandler(async (event) => {
  // Cek API Key
  await apiKeyAuth(event);

  // Ambil data dari form-data
  const form = await readMultipartFormData(event);
  let documentId = null;
  let signedFile = null;

  for (const field of form) {
    if (field.name === "documentId") documentId = field.data.toString(); // Konversi buffer ke string
    if (field.name === "signedFile") signedFile = field;
  }

  // Cek apakah field yang diperlukan sudah diisi
  if (!documentId || !signedFile)
    throw createError({
      statusCode: 400,
      message: "Field yang diperlukan tidak lengkap",
    });

  // Cari document berdasarkan documentId
  const document = await Document.findByPk(documentId, {
    include: [
      { model: User, attributes: ["name"] },
      { model: Application, attributes: ["name"] },
    ],
  });
  if (!document)
    throw createError({ statusCode: 404, message: "Dokumen tidak ditemukan" });

  // Cek apakah folder uploads/signed sudah ada
  const signedDir = path.resolve("./uploads/signed");
  if (!fs.existsSync(signedDir)) fs.mkdirSync(signedDir);

  // Simpan file yang diunggah ke folder uploads/signed
  const filePath = `${signedDir}/${signedFile.filename}`;
  fs.writeFileSync(filePath, signedFile.data);

  // Simpan data file yang diunggah ke tabel Document
  document.filename = signedFile.filename;
  document.status = "signed";
  await document.save();

  return {
    message: "Dokumen yang ditandatangani berhasil disimpan",
    data: {
      fileUrl: `/uploads/signed/${document.filename}`,
      applicationName: document.Application.name,
      userName: document.User.name,
      filename: document.filename,
      status: document.status,
    },
  };
});
