import { defineEventHandler, readMultipartFormData } from "h3";
import Document from "../models/Document.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  // Ambil data dari form-data
  const form = await readMultipartFormData(event);
  const { userNip, userName, applicationName, applicationUrl, file } =
    Object.fromEntries(form.map((f) => [f.name, f.value || f]));

  // Cek apakah field yang diperlukan sudah diisi
  if (!userNip || !userName || !applicationName || !applicationUrl || !file) {
    return { error: "Field yang diperlukan tidak lengkap" };
  }

  //   Buat atau cari user dan aplikasi berdasarkan NIP dan URL
  let user = await User.findOrCreate({
    where: { nip: userNip },
    defaults: { name: userName },
  });
  let application = await Application.findOrCreate({
    where: { url: applicationUrl },
    defaults: { name: applicationName },
  });

  //   Cek apakah folder uploads sudah ada
  const uploadDir = path.resolve("./uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  //   Simpan file yang diunggah ke folder uploads
  const filePath = `${uploadDir}/${file.filename}`;
  fs.writeFileSync(filePath, file.data);

  //   Simpan data file yang diunggah ke tabel Document
  const document = await Document.create({
    userId: user[0].id,
    applicationId: application[0].id,
    filename: file.filename,
  });

  return { message: "File berhasil diunggah", document };
});
