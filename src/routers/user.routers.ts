import express from "express";

import { authController } from "../controller/auth.controller";
import { userController } from "../controller/user.controller";
import { UserRole } from "../enums/user.enum";
import { checkRole } from "../middleware/user.middleware";

const router = express.Router();

router.put("/users/:userId/ban", checkRole(UserRole.MANAGER), (req, res) => {
  res.json({ message: "User has been banned." });
});

router.post("/new-user", userController.newUser);

router.get("/login", authController.login);
export default router;
