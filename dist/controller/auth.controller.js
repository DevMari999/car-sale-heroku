"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const user_enum_1 = require("../enums/user.enum");
const User_model_1 = __importDefault(require("../models/User.model"));
class AuthController {
    async newUser(req, res, next) {
        try {
            const { username, email, role, password } = req.body;
            if (role !== user_enum_1.UserRole.BUYER && role !== user_enum_1.UserRole.SELLER) {
                return res.status(400).json({
                    error: "Invalid role. Allowed roles are 'buyer' or 'seller'",
                });
            }
            const newUser = await User_model_1.default.create({ username, email, role, password });
            const token = jsonwebtoken_1.default.sign({ userId: newUser._id, role }, configs_1.configs.JWT_SECRET, {
                expiresIn: "1d",
            });
            res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
            return res.status(201).json({ user: newUser, token });
        }
        catch (e) {
            console.error("Error creating user:", e);
            res.status(500).json({ error: "Failed to create user" });
            next(e);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User_model_1.default.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, configs_1.configs.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
            return res.status(200).json({ user, token });
        }
        catch (e) {
            res.status(500).json({ error: "Login failed" });
            next(e);
        }
    }
    async logOut(req, res, next) {
        console.log("Logging out...");
        res.cookie("token", "", { maxAge: 0 });
        console.log("Cookie cleared.");
        res.redirect("/");
        console.log("Redirecting...");
    }
}
exports.authController = new AuthController();
