"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const api_err_1 = __importDefault(require("../errors/api.err"));
const User_model_1 = __importDefault(require("../models/User.model"));
class AuthService {
    async newUser(userData) {
        const { username, email, role, password } = userData;
        const ads_count = 0;
        const premium = false;
        const existingUser = await User_model_1.default.findOne({ email });
        if (existingUser) {
            throw new api_err_1.default("Email already in use", 400);
        }
        const newUser = await User_model_1.default.create({
            username,
            email,
            role,
            password,
            ads_count,
            premium,
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id, role, ads_count, premium }, configs_1.configs.JWT_SECRET, {
            expiresIn: "1d",
        });
        return { user: newUser, token };
    }
    async loginUser(credentials) {
        const { email, password } = credentials;
        const user = await User_model_1.default.findOne({ email });
        if (!user) {
            throw new api_err_1.default("Email is not registered", 404);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new api_err_1.default("Invalid password", 401);
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            role: user.role,
            ads_count: user.ads_count,
            premium: user.premium,
        }, configs_1.configs.JWT_SECRET, { expiresIn: "1h" });
        return { user, token };
    }
    logoutUser() {
        return "/";
    }
}
exports.authService = new AuthService();
