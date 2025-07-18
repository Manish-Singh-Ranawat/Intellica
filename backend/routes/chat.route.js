import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createNewChat,
  deleteChat,
  getAllChats,
  getChat,
  resumeChat,
} from "../controllers/chat.controller.js";
const router = express.Router();

router.get("/all", requireAuth(), getAllChats);
router.post("/new", requireAuth(), createNewChat);
router.get("/:id", requireAuth(), getChat);
router.put("/:id", requireAuth(), resumeChat);
router.delete("/delete/:id", requireAuth(), deleteChat);

export default router;
