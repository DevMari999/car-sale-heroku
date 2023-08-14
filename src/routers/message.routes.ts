import express from "express";

import { messageController } from "../controller/message.controller";

const router = express.Router();

router.post("/send", messageController.sendMessage);

export default router;
