import { Request, Response } from "express";
import { chatWithAi } from "./assistantService";


export const handleChat = async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const reply = await chatWithAi(prompt);
    res.json({ reply });
};