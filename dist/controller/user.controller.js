"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const user_enum_1 = require("../enums/user.enum");
const User_model_1 = __importDefault(require("../models/User.model"));
class UserController {
    async createManager(req, res, next) {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, configs_1.configs.JWT_SECRET);
            if (decodedToken.role !== user_enum_1.UserRole.ADMINISTRATOR) {
                return res.status(403).json({ error: "Access denied" });
            }
            const { username, email, password } = req.body;
            await User_model_1.default.create({
                username,
                email,
                password,
                role: user_enum_1.UserRole.MANAGER,
                premium: true,
            });
            return res.status(201).json({ message: "Manager user created" });
        }
        catch (error) {
            console.error("Error creating manager user:", error);
            res.status(500).json({ error: "Failed to create manager user" });
            next(error);
        }
    }
}
exports.userController = new UserController();
