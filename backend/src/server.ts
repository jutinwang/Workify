import express from "express";
import "dotenv/config";
import usersRouter from "./routes/students/users";
import authRouter from "./routes/auth";
import employerRouter from "./routes/employer/jobs";
import applicationsRouterStudent from './routes/students/applications';
import applicationsRouterEmployer from './routes/employer/applications';

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/users", usersRouter); 
app.use("/auth", authRouter); 
app.use("/employers", employerRouter); 
app.use("/employers", applicationsRouterEmployer); 
app.use("/applications", applicationsRouterStudent); 

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => console.log(`API listening on :${PORT}`));