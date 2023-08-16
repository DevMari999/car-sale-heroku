"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const user_enum_1 = require("../enums/user.enum");
const Message_model_1 = __importDefault(require("../models/Message.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
class UserService {
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, configs_1.configs.JWT_SECRET);
    }
    static async createUser(data) {
        await User_model_1.default.create({
            ...data,
            role: user_enum_1.UserRole.MANAGER,
            premium: true,
        });
    }
    static async upgradeUserToPremium(userId) {
        return await User_model_1.default.findByIdAndUpdate(userId, { premium: true }, { new: true });
    }
    static async getUserById(userId) {
        return await User_model_1.default.findById(userId);
    }
    static async getUserMessages(userId) {
        return await Message_model_1.default.find({ send_to: userId }).populate("send_by", "username");
    }
    static createUpdatedToken(userData) {
        return jsonwebtoken_1.default.sign(userData, configs_1.configs.JWT_SECRET, { expiresIn: "1d" });
    }
}
exports.UserService = UserService;
