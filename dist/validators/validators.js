"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidator = exports.emailValidator = void 0;
const api_err_1 = __importDefault(require("../errors/api.err"));
const emailValidator = (req, res, next) => {
    const email = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new api_err_1.default("Invalid email format", 400);
    }
    next();
};
exports.emailValidator = emailValidator;
const passwordValidator = (req, res, next) => {
    const password = req.body.password;
    if (password.length < 6) {
        throw new api_err_1.default("Password must be at least 6 characters", 400);
    }
    next();
};
exports.passwordValidator = passwordValidator;
