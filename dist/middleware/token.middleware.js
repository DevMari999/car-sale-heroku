"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const validateTokenMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, configs_1.configs.JWT_SECRET);
        res.locals.decodedToken = decodedToken;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.validateTokenMiddleware = validateTokenMiddleware;
