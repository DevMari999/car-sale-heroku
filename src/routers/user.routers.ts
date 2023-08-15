import express from "express";

import { authController } from "../controller/auth.controller";
import { userController } from "../controller/user.controller";
import { validateUserRole } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/new-user", validateUserRole, authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logOutUser);

router.get("/upgrade", userController.upgradeToPremium);
router.post("/create-manager", userController.createManager);
router.get("/:userId", userController.getUserById);

export default router;
