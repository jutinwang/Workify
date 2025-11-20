import express from "express";
import cors from "cors";
import "dotenv/config";
import usersRouter from "./routes/students/users";
import authRouter from "./routes/auth";
import employerRouter from "./routes/employer/jobs";
import applicationsRouterStudent from './routes/students/applications';
import applicationsRouterEmployer from './routes/employer/applications';
import studentProfileRouter from './routes/students/profile';
import employerProfileRouter from './routes/employer/profile';
import jobRouter from './routes/jobs';
import companyRouter from './routes/company';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/users", usersRouter); 
app.use("/auth", authRouter); 
app.use("/employers", employerRouter); 
app.use("/employers", applicationsRouterEmployer); 
app.use("/employers", employerProfileRouter);
app.use("/applications", applicationsRouterStudent); 
app.use("/students/profile", studentProfileRouter); 
app.use("/students", jobRouter); 
app.use("/company", companyRouter); 

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => console.log(`API listening on :${PORT}`));