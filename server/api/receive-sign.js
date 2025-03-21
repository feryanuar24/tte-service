import { defineEventHandler, readMultipartFormData } from "h3";
import Document from "../models/Document";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  // Ambil data dari form-data
  const form = await readMultipartFormData(event);
  const { documentId, file } = Object.fromEntries(
    form.map((f) => [f.name, f.value || f])
  );

  //   Cek apakah field yang diperlukan sudah diisi
  if (!documentId || !file)
    return { error: "Field yang diperlukan tidak lengkap" };

  //   Cari dokumen berdasarkan ID
  const document = await Document.findByPk(documentId);
  if (!document) return { error: "Dokumen tidak ditemukan" };

  // Cek apakah folder signed-docs sudah ada
  const uploadDir = path.resolve("./signed-docs");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  //   Simpan file yang diunggah ke folder signed-docs
  const filePath = `${uploadDir}/${file.filename}`;
  fs.writeFileSync(filePath, file.data);

  //   Update status dokumen menjadi "signed"
  document.status = "signed";
  await document.save();

  return { message: "Dokumen yang ditandatangani telah disimpan", document };
});
