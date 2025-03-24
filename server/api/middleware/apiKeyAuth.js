import { defineEventHandler, getHeader } from "h3";
import Application from "../../models/Application.js";

export default defineEventHandler(async (event) => {
  // Ambil API Key dari header
  const apiKey = getHeader(event, "x-api-key");

  // Cek apakah API Key ada
  if (!apiKey) {
    throw createError({ statusCode: 401, message: "API Key diperlukan" });
  }

  // Cari aplikasi berdasarkan API Key
  const application = await Application.findOne({ where: { apiKey } });
  if (!application) {
    throw createError({ statusCode: 403, message: "API Key tidak valid" });
  }

  // Simpan application info di context agar bisa diakses di rute lainnya
  event.context.application = {
    id: application.id,
    name: application.name,
  };
});
