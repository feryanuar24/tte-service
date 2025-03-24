import crypto from "crypto";
import { defineEventHandler, readBody } from "h3";
import Application from "../../models/Application.js";

export default defineEventHandler(async (event) => {
  // Ambil data dari body
  const { url, name } = await readBody(event);

  // Cek apakah name dan url sudah diisi
  if (!url || !name) {
    throw createError({
      statusCode: 400,
      message: "Nama dan URL wajib diisi",
    });
  }

  // Cek apakah aplikasi sudah terdaftar
  const existingApp = await Application.findOne({ where: { url } });
  if (existingApp)
    return {
      message: "Aplikasi sudah terdaftar",
      apiKey: existingApp.apiKey,
    };

  // Buat aplikasi baru
  const newApp = await Application.create({
    url,
    name,
    apiKey: crypto.randomBytes(32).toString("hex"),
  });

  return {
    message: "Aplikasi berhasil didaftarkan",
    apiKey: newApp.apiKey,
  };
});
