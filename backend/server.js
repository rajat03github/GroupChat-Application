import express from "express";
import { chats } from "./data.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./database.js";

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/chats", (req, res) => {
  res.send(chats);
});

app.get("/:id", (req, res) => {
  const userChat = chats.find((c) => c._id === req.params.id);
  res.send(userChat);
});
app.listen(process.env.PORT, () => {
  console.log(`Server Started on http://localhost:${process.env.PORT}`);
});
