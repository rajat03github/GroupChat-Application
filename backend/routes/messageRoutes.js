import express from "express";
import Authorization from "../middleware/Auth.js";
import {
  fetchAllMessages,
  sendMessage,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.post("/", Authorization, sendMessage);
router.get("/:chatId", Authorization, fetchAllMessages); //Fetch all msgs for single chat

export default router;
