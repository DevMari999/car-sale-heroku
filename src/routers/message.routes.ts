import express from "express";

import { messageController } from "../controller/message.controller";
import { validateTokenMiddleware } from "../middleware/token.middleware";

const router = express.Router();

router.post("/send", validateTokenMiddleware, messageController.sendMessage);

export default router;
