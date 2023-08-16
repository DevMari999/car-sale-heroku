"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_err_1 = __importDefault(require("../errors/api.err"));
const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof api_err_1.default) {
        return res.status(err.statusCode).json({
            errors: {
                message: err.message,
            },
        });
    }
    console.error("An unexpected error occurred:", err);
    return res.status(500).json({
        errors: {
            message: "Internal server error",
        },
    });
};
exports.default = globalErrorHandler;
