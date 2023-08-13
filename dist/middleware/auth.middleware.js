"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("../configs/configs");
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
