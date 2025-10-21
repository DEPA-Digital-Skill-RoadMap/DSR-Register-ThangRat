  import express from "express";
  import cors from "cors";
  import mysql from "mysql2/promise";
  import multer from "multer";
  import dotenv from "dotenv";

  dotenv.config();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // ตั้งค่าการเชื่อมต่อฐานข้อมูล
  const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4"
  });


  // ✅ API อื่น ๆ (เหมือนของคุณเดิม)
  app.get("/api/groups", async (req, res) => {
    const [rows] = await db.query("SELECT DISTINCT `group` FROM coursealls ORDER BY `group`");
    res.json(rows);
  });

  app.get("/api/semigroups", async (req, res) => {
    const { group } = req.query;
    const [rows] = await db.query(
      "SELECT DISTINCT semigroup FROM coursealls WHERE `group` = ? ORDER BY semigroup",
      [group]
    );
    res.json(rows);
  });

  // ✅ 1. ดึง Group ทั้งหมด
  app.get("/api/groups", async (req, res) => {
    const [rows] = await db.query("SELECT DISTINCT `group` FROM coursealls ORDER BY `group`");
    res.json(rows);
  });

  // ✅ 2. ดึง Semigroup ตาม Group
  app.get("/api/semigroups", async (req, res) => {
    const { group } = req.query;
    const [rows] = await db.query(
      "SELECT DISTINCT semigroup FROM coursealls WHERE `group` = ? ORDER BY semigroup",
      [group]
    );
    res.json(rows);
  });

  // ✅ 3. ดึง Level ตาม Group + Semigroup
  app.get("/api/levels", async (req, res) => {
    const { group, semigroup } = req.query;
    const [rows] = await db.query(
      "SELECT DISTINCT `level` FROM coursealls WHERE `group` = ? AND semigroup = ? ORDER BY `level`",
      [group, semigroup]
    );
    res.json(rows);
  });

  // ✅ 4. ดึง CourseGroup ตาม Group + Semigroup + Level
  app.get("/api/coursegroups", async (req, res) => {
    const { group, semigroup, level } = req.query;
    const [rows] = await db.query(
      "SELECT DISTINCT coursegroup FROM coursealls WHERE `group` = ? AND semigroup = ? AND `level` = ? ORDER BY coursegroup",
      [group, semigroup, level]
    );
    res.json(rows);
  });

  // ✅ 5. ดึง Courses ตาม Group + Semigroup + Level + CourseGroup
  app.get("/api/courses", async (req, res) => {
    const { group, semigroup, level, coursegroup } = req.query;
    const [rows] = await db.query(
      "SELECT courses FROM coursealls WHERE `group` = ? AND semigroup = ? AND `level` = ? AND coursegroup = ? ORDER BY courses",
      [group, semigroup, level, coursegroup]
    );
    res.json(rows);
  });

  app.get("/api/otherdocs", async (req, res) => {
    try {
      const { group, semigroup, level, coursegroup, courses } = req.query;

      const [rows] = await db.query(
        "SELECT otherdoc FROM coursealls WHERE `group` = ? AND semigroup = ? AND `level` = ? AND coursegroup = ? AND courses = ? ORDER BY otherdoc",
        [group, semigroup, level, coursegroup, courses]
      );

      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.post("/api/saveSelection", async (req, res) => {
    let {
      idcard, name, surname, email, Numphone, Birth,
      group, semigroup, level, coursegroup, course,
      IDCardlink, Otherdoclink
    } = req.body;
    try {
      const [result] = await db.execute(
        `INSERT INTO registor (idcard, firstname, lastname, email, numphone, birthdate, \`group\`, semigroup, level, coursegroup, courses, IDCardlink, Otherdoclink)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [idcard, name, surname, email, Numphone, Birth, group, semigroup, level, coursegroup, course, IDCardlink, Otherdoclink]
      );

      res.json({ success: true, message: "Saved successfully", id: result.insertId });
    } catch (err) {
      console.error("Database Error:", err);
      res.status(500).json({ success: false, message: "Database error" });
    }
  });

  

  
  app.listen(3000,"localhost",() => console.log("✅ Server running on http://localhost:3000"));