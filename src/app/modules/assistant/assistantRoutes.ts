import express from "express";
import { handleChat } from "./assistantController";


const router = express.Router();
router.post("/chat", handleChat);
export default router;