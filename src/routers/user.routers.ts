import express from "express";

import { authController } from "../controller/auth.controller";
import { userController } from "../controller/user.controller";
import { validateUserRole } from "../middleware/auth.middleware";
import { validateTokenMiddleware } from "../middleware/token.middleware";

const router = express.Router();

router.post("/new-user", validateUserRole, authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logOutUser);

router.get(
  "/upgrade",
  validateTokenMiddleware,
  userController.upgradeToPremium,
);
router.post(
  "/create-manager",
  validateTokenMiddleware,
  userController.createManager,
);
router.get("/:userId", validateTokenMiddleware, userController.getUserById);

export default router;
