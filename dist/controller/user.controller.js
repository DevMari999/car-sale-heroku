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
    async upgradeToPremium(req, res, next) {
        try {
            const token = req.cookies.token;
            let decodedToken;
            try {
                decodedToken = jsonwebtoken_1.default.verify(token, configs_1.configs.JWT_SECRET);
            }
            catch (error) {
                res.status(401).json({ error: "Invalid or expired token" });
            }
            const userRole = decodedToken.role;
            if (userRole !== user_enum_1.UserRole.SELLER) {
                res.status(403).json({ error: "Only sellers can upgrade to premium" });
            }
            const updatedUser = await User_model_1.default.findByIdAndUpdate(decodedToken.userId, { premium: true }, { new: true });
            const updatedToken = jsonwebtoken_1.default.sign({
                userId: updatedUser._id,
                role: updatedUser.role,
                ads_count: updatedUser.ads_count,
                premium: updatedUser.premium,
            }, configs_1.configs.JWT_SECRET, {
                expiresIn: "1d",
            });
            res.cookie("token", updatedToken, { maxAge: 3600000, httpOnly: true });
            res.redirect("/");
        }
        catch (error) {
            console.error("Error upgrading to premium:", error);
            res.status(500).json({ error: "Failed to upgrade to premium" });
            next(error);
        }
    }
}
exports.userController = new UserController();
