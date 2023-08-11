import { NextFunction, Request, Response } from "express";

import { UserRole } from "../enums/user.enum";
import User from "../models/User.model";
import { IUser } from "../types/user.types";

class UserController {
  public async newUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { username, email, role, password } = req.body;

      if (role !== UserRole.BUYER && role !== UserRole.SELLER) {
        return res.status(400).json({
          error: "Invalid role. Allowed roles are 'buyer' or 'seller'",
        });
      }

      const newUser = await User.create({ username, email, role, password });

      // Return the newly created user
      return res.status(201).json(newUser);
    } catch (e) {
      console.error("Error creating user:", e); // Log the error
      res.status(500).json({ error: "Failed to create user" });
      next(e);
    }
  }
}

export const userController = new UserController();
