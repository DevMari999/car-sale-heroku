"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controller/message.controller");
const token_middleware_1 = require("../middleware/token.middleware");
const router = express_1.default.Router();
router.post("/send", token_middleware_1.validateTokenMiddleware, message_controller_1.messageController.sendMessage);
exports.default = router;
