import express from "express";
import "dotenv/config";
// import usersRouter from "./routes/users.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => console.log(`API listening on :${PORT}`));