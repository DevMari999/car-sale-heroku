import express from "express";

import { authController } from "../controller/auth.controller";
import { userController } from "../controller/user.controller";
import { validateUserRole } from "../middleware/auth.middleware";
import { validateTokenMiddleware } from "../middleware/token.middleware";
import { emailValidator, passwordValidator } from "../validators/validators";

const router = express.Router();

router.post(
  "/new-user",
  emailValidator,
  passwordValidator,
  validateUserRole,
  authController.registerUser,
);
router.post(
  "/login",
  emailValidator,
  passwordValidator,
  authController.loginUser,
);
router.get("/logout", authController.logOutUser);

router.get(
  "/upgrade",
  validateTokenMiddleware,
  userController.upgradeToPremium,
);
router.post(
  "/create-manager",
  emailValidator,
  passwordValidator,
  validateTokenMiddleware,
  userController.createManager,
);
router.get("/:userId", validateTokenMiddleware, userController.getUserById);

export default router;
