import express from "express";
import Authorization from "../middleware/Auth.js";
import {
  accessChatOnetoOne,
  createGroupChat,
  fetchChatsforCurrentUser,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.post("/", Authorization, accessChatOnetoOne);
router.get("/", Authorization, fetchChatsforCurrentUser);
router.post("/group", Authorization, createGroupChat);
// router.put("/renamegroup", Authorization, renameGroupChat);
// router.put("/groupremove", Authorization, removeFromGroup);
// router.put("/addtogroup", Authorization, addToGroup);

export default router;
