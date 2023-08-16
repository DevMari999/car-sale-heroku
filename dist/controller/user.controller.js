"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_enum_1 = require("../enums/user.enum");
const user_service_1 = require("../services/user.service");
class UserController {
    async createManager(req, res, next) {
        const decodedToken = res.locals.decodedToken;
        if (decodedToken.role !== user_enum_1.UserRole.ADMINISTRATOR) {
            return res.status(403).json({ error: "Access denied" });
        }
        try {
            const { username, email, password } = req.body;
            await user_service_1.UserService.createUser({ username, email, password });
            return res.status(201).json({ message: "Manager user created" });
        }
        catch (error) {
            console.error("Error creating manager user:", error);
            res.status(500).json({ error: "Failed to create manager user" });
            next(error);
        }
    }
    async upgradeToPremium(req, res, next) {
        const decodedToken = res.locals.decodedToken;
        if (decodedToken.role !== user_enum_1.UserRole.SELLER) {
            return res
                .status(403)
                .json({ error: "Only sellers can upgrade to premium" });
        }
        try {
            const updatedUser = await user_service_1.UserService.upgradeUserToPremium(decodedToken.userId);
            const updatedToken = user_service_1.UserService.createUpdatedToken({
                userId: updatedUser._id,
                role: updatedUser.role,
                ads_count: updatedUser.ads_count,
                premium: updatedUser.premium,
            });
            res.cookie("token", updatedToken, { maxAge: 3600000, httpOnly: true });
            res.redirect("/");
        }
        catch (error) {
            console.error("Error upgrading to premium:", error);
            res.status(500).json({ error: "Failed to upgrade to premium" });
            next(error);
        }
    }
    async getUserById(req, res, next) {
        const decodedToken = res.locals.decodedToken;
        try {
            const user = await user_service_1.UserService.getUserById(decodedToken.userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const messages = await user_service_1.UserService.getUserMessages(decodedToken.userId);
            res.render("account", { user, messages });
        }
        catch (error) {
            console.error("Error retrieving user:", error);
            res.status(500).json({ error: "Failed to get user" });
            next(error);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
