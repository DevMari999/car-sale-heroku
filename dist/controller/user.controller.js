"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_enum_1 = require("../enums/user.enum");
const User_model_1 = __importDefault(require("../models/User.model"));
class UserController {
    async newUser(req, res, next) {
        try {
            const { username, email, role, password } = req.body;
            if (role !== user_enum_1.UserRole.BUYER && role !== user_enum_1.UserRole.SELLER) {
                return res.status(400).json({
                    error: "Invalid role. Allowed roles are 'buyer' or 'seller'",
                });
            }
            const newUser = await User_model_1.default.create({ username, email, role, password });
            return res.status(201).json(newUser);
        }
        catch (e) {
            console.error("Error creating user:", e);
            res.status(500).json({ error: "Failed to create user" });
            next(e);
        }
    }
}
exports.userController = new UserController();
