import express from "express";
import cors from "cors";
import "dotenv/config";
import usersRouter from "./routes/students/users";
import authRouter from "./routes/auth";
import employerRouter from "./routes/employer/jobs";
import applicationsRouterStudent from './routes/students/applications';
import applicationsRouterEmployer from './routes/employer/applications';
import studentProfileRouter from './routes/students/profile';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  credentials: true,
}));

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/users", usersRouter); 
app.use("/auth", authRouter); 
app.use("/employers", employerRouter); 
app.use("/employers", applicationsRouterEmployer); 
app.use("/applications", applicationsRouterStudent); 
app.use("/students/profile", studentProfileRouter); 

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => console.log(`API listening on :${PORT}`));