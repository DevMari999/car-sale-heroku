"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const api_err_1 = __importDefault(require("../errors/api.err"));
const auth_service_1 = require("../services/auth.service");
class AuthController {
    constructor() {
        this.registerUser = async (req, res, next) => {
            try {
                const user = await auth_service_1.authService.newUser(req.body);
                res.cookie("token", user.token, { maxAge: 3600000, httpOnly: true });
                res.status(201).json(user);
            }
            catch (error) {
                if (error instanceof api_err_1.default) {
                    res
                        .status(error.statusCode)
                        .json({ errors: { message: error.message } });
                }
                else {
                    console.error(error);
                    res.status(500).json({ errors: { message: "Internal Server Error" } });
                }
                next(error);
            }
        };
        this.loginUser = async (req, res, next) => {
            try {
                const user = await auth_service_1.authService.loginUser(req.body);
                res.cookie("token", user.token, { maxAge: 3600000, httpOnly: true });
                res.status(200).json(user);
            }
            catch (error) {
                if (error instanceof api_err_1.default) {
                    if (error.message === "Email is not registered") {
                        res
                            .status(error.statusCode)
                            .json({ errors: { message: error.message } });
                    }
                    else if (error.message === "Invalid password") {
                        res
                            .status(error.statusCode)
                            .json({ errors: { message: error.message } });
                    }
                    else {
                        res
                            .status(error.statusCode)
                            .json({ errors: { message: "Login failed" } });
                    }
                }
                else {
                    console.error(error);
                    res.status(500).json({ errors: { message: "Internal Server Error" } });
                }
                next(error);
            }
        };
        this.logOutUser = (req, res) => {
            const redirectPath = auth_service_1.authService.logoutUser();
            res.cookie("token", "", { maxAge: 0 });
            res.redirect(redirectPath);
        };
    }
}
exports.authController = new AuthController();
