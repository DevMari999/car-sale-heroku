"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    constructor() {
        this.registerUser = async (req, res, next) => {
            try {
                const user = await auth_service_1.authService.newUser(req.body);
                res.cookie("token", user.token, { maxAge: 3600000, httpOnly: true });
                res.status(201).json(user);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
                next(e);
            }
        };
        this.loginUser = async (req, res, next) => {
            try {
                const user = await auth_service_1.authService.loginUser(req.body);
                res.cookie("token", user.token, { maxAge: 3600000, httpOnly: true });
                res.status(200).json(user);
            }
            catch (e) {
                if (e.message === "Invalid credentials") {
                    res.status(401).json({ error: e.message });
                }
                else {
                    res.status(500).json({ error: "Login failed" });
                }
                next(e);
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
