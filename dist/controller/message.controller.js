"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const message_service_1 = require("../services/message.service");
class MessageController {
    async sendMessage(req, res, next) {
        try {
            const { header, content, recipientUserId } = req.body;
            const senderUserId = res.locals.decodedToken.userId;
            const newMessage = await message_service_1.messageService.sendMessage(senderUserId, header, content, recipientUserId);
            return res.status(201).json({ message: newMessage });
        }
        catch (e) {
            res.status(500).json({ error: "Failed to send message" });
            next(e);
        }
    }
}
exports.messageController = new MessageController();
