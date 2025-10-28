import express from "express";
import "dotenv/config";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/users", usersRouter); 
app.use("/auth", authRouter); 

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => console.log(`API listening on :${PORT}`));