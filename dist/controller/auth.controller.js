"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const User_model_1 = __importDefault(require("../models/User.model"));
class AuthController {
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
            return res.status(200).json({ token });
        }
        catch (e) {
            res.status(500).json({ error: "Login failed" });
            next(e);
        }
    }
}
exports.authController = new AuthController();
