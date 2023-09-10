import express from "express";
import { chats } from "./data.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./database.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();

connectDB();
app.use(express.json()); //! use this before routes

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("Working");
});

app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server Started on http://localhost:${process.env.PORT}`);
});
