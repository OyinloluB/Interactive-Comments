import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import process from "process";
import { PrismaClient } from "@prisma/client";

import commentsRouter from "./routes/comment.routes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  next();
});

// routes
app.use("/api/comment", commentsRouter);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
