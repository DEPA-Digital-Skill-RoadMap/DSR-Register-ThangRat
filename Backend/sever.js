// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
app.use(cors({ origin: `${process.env.DNS}` })); // 🔒 ถ้าระบบจริง ควรใส่ domain เช่น "https://your-frontend.com"
app.use(express.json());

// ✅ ทดสอบ API
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ บันทึกข้อมูลจากหน้าเว็บ
app.post("/save", async (req, res) => {
  try {
    const { idcard, name, surname, email, Numphone, Birth } = req.body;

    // ตรวจสอบว่าข้อมูลครบไหม
    if (!idcard || !name || !surname || !email) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    // ใช้ parameterized query เพื่อป้องกัน SQL Injection
    const sql = `
      INSERT INTO registor (idcard, firstname, lastname, email, numphone, birthdate)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [idcard, name, surname, email, Numphone, Birth]);

    res.json({ message: "บันทึกข้อมูลสำเร็จ ✅" });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
});

// ✅ เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
