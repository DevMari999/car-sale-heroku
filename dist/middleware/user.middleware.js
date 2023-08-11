"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const checkRole = (role) => {
    return (req, res, next) => {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, configs_1.configs.JWT_SECRET);
            if (decoded.role === role) {
                next();
            }
            else {
                res.status(403).json({ msg: "Access denied" });
            }
        }
        catch (err) {
            res.status(401).json({ msg: "Token is not valid" });
        }
    };
};
exports.checkRole = checkRole;
