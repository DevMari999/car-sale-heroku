"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const user_controller_1 = require("../controller/user.controller");
const user_enum_1 = require("../enums/user.enum");
const user_middleware_1 = require("../middleware/user.middleware");
const router = express_1.default.Router();
router.put("/users/:userId/ban", (0, user_middleware_1.checkRole)(user_enum_1.UserRole.MANAGER), (req, res) => {
    res.json({ message: "User has been banned." });
});
router.post("/new-user", user_controller_1.userController.newUser);
router.get("/login", auth_controller_1.authController.login);
exports.default = router;
