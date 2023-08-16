"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const user_controller_1 = require("../controller/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const token_middleware_1 = require("../middleware/token.middleware");
const validators_1 = require("../validators/validators");
const router = express_1.default.Router();
router.post("/new-user", validators_1.emailValidator, validators_1.passwordValidator, auth_middleware_1.validateUserRole, auth_controller_1.authController.registerUser);
router.post("/login", validators_1.emailValidator, validators_1.passwordValidator, auth_controller_1.authController.loginUser);
router.get("/logout", auth_controller_1.authController.logOutUser);
router.get("/upgrade", token_middleware_1.validateTokenMiddleware, user_controller_1.userController.upgradeToPremium);
router.post("/create-manager", validators_1.emailValidator, validators_1.passwordValidator, token_middleware_1.validateTokenMiddleware, user_controller_1.userController.createManager);
router.get("/:userId", token_middleware_1.validateTokenMiddleware, user_controller_1.userController.getUserById);
exports.default = router;
