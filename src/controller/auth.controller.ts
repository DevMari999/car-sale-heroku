import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import User from "../models/User.model";

class AuthController {
  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        configs.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return res.status(200).json({ token });
    } catch (e) {
      res.status(500).json({ error: "Login failed" });
      next(e);
    }
  }
}

export const authController = new AuthController();
