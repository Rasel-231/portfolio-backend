import express from "express";
import { messageController } from "./messageController";
const router = express.Router();
router.get("/read", messageController.getAllMessages);
router.post("/send", messageController.createMessage);
router.patch("/:id", messageController.updateMessage);
router.delete("/:id", messageController.deleteMessage);
export const messageRoutes = router;