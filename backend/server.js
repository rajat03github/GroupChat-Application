import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./database.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
const app = express();

import { Server } from "socket.io";

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
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);

const host = app.listen(process.env.PORT, () => {
  console.log(`Server Started on http://localhost:${process.env.PORT}`);
});

const io = new Server(host, {
  pingTimeout: 60000, //60 seconds
  cors: {
    origin: "http://localhost:5173",
  },
});

//!first create a conneection with the host and in frontEnd -
// ! then make a setup for the room with current login user
// ! then make a join chat with that room id so that any user that want to chat will join that room

io.on("connection", (socket) => {
  // ! takes userData sent from frontEnd and create a new personal socket for the user with on function as it works as listener

  socket.on("setup", (userData) => {
    socket.join(userData._id); //join this room
    socket.emit("connected");
  });

  //! this function will join the chat in that room and takes room id from frontEnd

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log(`User Joined ${roomId}`);
  });

  //! create a new socket for typing

  socket.on("typing", (roomId) => {
    socket.in(roomId).emit("typing");
  });

  //! create a new socket for stop typing

  socket.on("stop typing", (roomId) => {
    socket.in(roomId).emit("stop typing");
  });

  //! realtime send msg

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    //* if 5 users in room including me , and then i sent a msg, that msg should not be recieved by me , only those other 4

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;

      //* in means inside that user's room . emit means send that message

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER disconnected");
    socket.leave(userData._id);
  });
});
