import express from "express";

import { authController } from "../controller/auth.controller";
import { userController } from "../controller/user.controller";

const router = express.Router();

router.post("/new-user", authController.newUser);
router.post("/login", authController.login);
router.get("/logout", authController.logOut);
router.post("/create-manager", userController.createManager);
export default router;
