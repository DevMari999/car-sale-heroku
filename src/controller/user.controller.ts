import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import { UserRole } from "../enums/user.enum";
import User from "../models/User.model";

class UserController {
  public async createManager(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decodedToken = jwt.verify(token, configs.JWT_SECRET) as {
        userId: string;
        role: UserRole;
      };

      if (decodedToken.role !== UserRole.ADMINISTRATOR) {
        return res.status(403).json({ error: "Access denied" });
      }

      const { username, email, password } = req.body;
      await User.create({
        username,
        email,
        password,
        role: UserRole.MANAGER,
        premium: true,
      });

      return res.status(201).json({ message: "Manager user created" });
    } catch (error) {
      console.error("Error creating manager user:", error);
      res.status(500).json({ error: "Failed to create manager user" });
      next(error);
    }
  }
}

export const userController = new UserController();
