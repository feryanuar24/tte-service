import db from "./database.js";

const migrate = async () => {
  try {
    // Hapus tabel lama & buat ulang
    await db.sync({ force: true });
    console.log("✅ Database berhasil dimigrasi");
  } catch (error) {
    console.error("❌ Migrasi gagal:", error);
  } finally {
    process.exit();
  }
};

migrate();
