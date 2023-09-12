import express from "express";
import {
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

import Authorization from "../middleware/Auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.post("/login", loginUser);
router.get("/getusers", Authorization, getUsers);

export default router;
