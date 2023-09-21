import { NextFunction, Request, Response } from "express";

import AppError from "../errors/api.err";
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
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ errors: { message: error.message } });
      } else {
        res.status(500).json({ errors: { message: "Internal Server Error" } });
      }
      next(error);
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
    } catch (error) {
      if (error instanceof AppError) {
        if (error.message === "Email is not registered") {
          res
            .status(error.statusCode)
            .json({ errors: { message: error.message } });
        } else if (error.message === "Invalid password") {
          res
            .status(error.statusCode)
            .json({ errors: { message: error.message } });
        } else {
          res
            .status(error.statusCode)
            .json({ errors: { message: "Login failed" } });
        }
      } else {
        res.status(500).json({ errors: { message: "Internal Server Error" } });
      }
      next(error);
    }
  };

  logOutUser = (req: Request, res: Response): void => {
    const redirectPath = authService.logoutUser();
    res.cookie("token", "", { maxAge: 0 });
    res.redirect(redirectPath);
  };
}

export const authController = new AuthController();
