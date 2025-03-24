import fs from "fs";
import path from "path";
import { defineEventHandler, readMultipartFormData } from "h3";
import User from "../../models/User.js";
import Document from "../../models/Document.js";
import Application from "../../models/Application.js";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

export default defineEventHandler(async (event) => {
  // Jalankan middleware auth
  await apiKeyAuth(event);

  // Ambil applicationId dari context yang sudah diset oleh middleware apiKeyAuth
  const applicationId = event.context.application.id;

  // Ambil data dari form-data
  const form = await readMultipartFormData(event);
  let userNip = null;
  let file = null;

  for (const field of form) {
    if (field.name === "userNip") userNip = field.data.toString(); // Konversi buffer ke string
    if (field.name === "file") file = field;
  }

  // Cek apakah field yang diperlukan sudah diisi
  if (!userNip || !file) {
    return { error: "Field yang diperlukan tidak lengkap" };
  }

  // Cari user berdasarkan NIP
  const user = await User.findOne({ where: { nip: userNip } });
  if (!user) {
    return { error: "User tidak ditemukan" };
  }

  //   Cek apakah folder uploads sudah ada
  const uploadDir = path.resolve("./uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  //   Simpan file yang diunggah ke folder uploads
  const filePath = `${uploadDir}/${file.filename}`;
  fs.writeFileSync(filePath, file.data);

  //   Simpan data file yang diunggah ke tabel Document
  const document = await Document.create({
    userId: user.id,
    applicationId: applicationId,
    filename: file.filename,
  });

  // Ambil data lengkap document dengan join ke User dan Application
  const fullDocument = await Document.findByPk(document.id, {
    include: [
      { model: User, attributes: ["name"] },
      { model: Application, attributes: ["name"] },
    ],
  });

  return {
    message: "File berhasil diunggah",
    data: {
      applicationName: fullDocument.Application.name,
      userName: fullDocument.User.name,
      filename: fullDocument.filename,
      statusDocument: fullDocument.status,
    },
  };
});
