import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";

class AuthController {
  registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await authService.newUser(req.body);
      res.cookie("token", user.token, { maxAge: 3600000, httpOnly: true });
      res.status(201).json(user);
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  };

  loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await authService.loginUser(req.body);
      res.cookie("token", user.token, { maxAge: 3600000, httpOnly: true });
      res.status(200).json(user);
    } catch (e) {
      if (e.message === "Invalid credentials") {
        res.status(401).json({ error: e.message });
      } else {
        res.status(500).json({ error: "Login failed" });
      }
      next(e);
    }
  };

  logOutUser = (req: Request, res: Response): void => {
    const redirectPath = authService.logoutUser();
    res.cookie("token", "", { maxAge: 0 });
    res.redirect(redirectPath);
  };
}

export const authController = new AuthController();
