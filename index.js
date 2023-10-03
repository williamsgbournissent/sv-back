import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 8800;

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

import registerRouter from "./routes/register.routes.js";
import authRouter from "./routes/auth.routes.js";
import refreshRouter from "./routes/refresh.routes.js";
import logoutRouter from "./routes/logout.routes.js";

app.use("/", registerRouter);
app.use("/", authRouter);
app.use("/", refreshRouter);
app.use("/", logoutRouter);

app.listen(PORT, () => {
  console.log(`> Backend running on port ${PORT}`);
});
