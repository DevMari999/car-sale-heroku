"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.validateUserRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("../configs/configs");
const user_enum_1 = require("../enums/user.enum");
const User_model_1 = __importDefault(require("../models/User.model"));
const checkUser = async (req, res, next) => {
    const token = req.cookies.token;
    res.locals.user = null;
    if (!token) {
        next();
        return;
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, configs_1.configs.JWT_SECRET);
        const userId = new mongoose_1.default.Types.ObjectId(decodedToken.userId);
        const user = await User_model_1.default.findById(userId);
        res.locals.user = user;
    }
    catch (error) {
    }
    finally {
        next();
    }
};
exports.checkUser = checkUser;
const validateUserRole = (req, res, next) => {
    const { role } = req.body;
    if (role !== user_enum_1.UserRole.BUYER && role !== user_enum_1.UserRole.SELLER) {
        return res.status(400).json({
            error: "Invalid role. Allowed roles are 'buyer' or 'seller'",
        });
    }
    next();
};
exports.validateUserRole = validateUserRole;
