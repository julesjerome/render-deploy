import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// Create table if not exists
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100)
    );
  `);
};
initDB();

// Get users
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

// Add user
app.post("/users", async (req, res) => {
  const { name } = req.body;
  await pool.query("INSERT INTO users(name) VALUES($1)", [name]);
  res.json({ message: "User added" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
