"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const Message_model_1 = __importDefault(require("../models/Message.model"));
class MessageService {
    async sendMessage(senderUserId, header, content, recipientUserId) {
        const newMessage = await Message_model_1.default.create({
            header,
            content,
            send_to: recipientUserId,
            send_by: senderUserId,
        });
        return newMessage;
    }
}
exports.messageService = new MessageService();
