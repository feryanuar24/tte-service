import db from "./database.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import Document from "../models/Document.js";

const seed = async () => {
  try {
    // Pastikan koneksi ke database
    await db.authenticate();

    console.log("✅ Koneksi ke database berhasil, mulai seeding...");

    // Seeder data aplikasi
    await Application.bulkCreate([
      { url: "http://example.com/a", name: "Aplikasi A", apiKey: "apikeyA" },
      { url: "http://example.com/b", name: "Aplikasi B", apiKey: "apikeyB" },
      { url: "http://example.com/c", name: "Aplikasi C", apiKey: "apikeyC" },
      { url: "http://example.com/d", name: "Aplikasi D", apiKey: "apikeyD" },
      { url: "http://example.com/e", name: "Aplikasi E", apiKey: "apikeyE" },
    ]);

    // Seeder data user
    await User.bulkCreate([
      { nip: "123456789012345678", name: "User A" },
      { nip: "876543210987654321", name: "User B" },
      { nip: "112233445566778899", name: "User C" },
      { nip: "998877665544332211", name: "User D" },
      { nip: "123123123123123123", name: "User E" },
      { nip: "321321321321321321", name: "User F" },
      { nip: "456456456456456456", name: "User G" },
      { nip: "654654654654654654", name: "User H" },
      { nip: "789789789789789789", name: "User I" },
      { nip: "987987987987987987", name: "User J" },
    ]);

    // Seeder data dokumen
    await Document.bulkCreate([
      { userId: 1, applicationId: 1, filename: "file1.pdf" },
      { userId: 1, applicationId: 2, filename: "file2.pdf" },
      { userId: 2, applicationId: 3, filename: "file3.pdf" },
      { userId: 2, applicationId: 4, filename: "file4.pdf" },
      { userId: 3, applicationId: 5, filename: "file5.pdf" },
      { userId: 3, applicationId: 1, filename: "file6.pdf" },
      { userId: 4, applicationId: 2, filename: "file7.pdf" },
      { userId: 4, applicationId: 3, filename: "file8.pdf" },
      { userId: 5, applicationId: 4, filename: "file9.pdf" },
      { userId: 5, applicationId: 5, filename: "file10.pdf" },
    ]);

    console.log("✅ Seeder berhasil dijalankan");
  } catch (error) {
    console.error("❌ Seeder gagal:", error);
  } finally {
    process.exit();
  }
};

seed();
