import express from "express";
import Authorization from "../middleware/Auth.js";
import { accessChat } from "../controllers/chatControllers.js";

const router = express.Router();

router.post("/", Authorization, accessChat);
// router.get("/", Authorization, fetchChats);
// router.post("/group", Authorization, createGroupChat);
// router.put("/renamegroup", Authorization, renameGroupChat);
// router.put("/groupremove", Authorization, removeFromGroup);
// router.put("/addtogroup", Authorization, addToGroup);

export default router;
