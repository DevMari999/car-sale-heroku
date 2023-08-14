"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const user_controller_1 = require("../controller/user.controller");
const router = express_1.default.Router();
router.post("/new-user", auth_controller_1.authController.newUser);
router.post("/login", auth_controller_1.authController.login);
router.get("/logout", auth_controller_1.authController.logOut);
router.get("/upgrade", user_controller_1.userController.upgradeToPremium);
router.post("/create-manager", user_controller_1.userController.createManager);
exports.default = router;
