"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_err_1 = __importDefault(require("../errors/api.err"));
function errorHandler(err, req, res, next) {
    if (err instanceof api_err_1.default) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }
    else {
        console.error("Unexpected error:", err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
}
exports.errorHandler = errorHandler;
