import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import { UserRole } from "../enums/user.enum";
import User from "../models/User.model";
import { IUser } from "../types/user.types";

class AuthController {
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

      const ads_count = 0;
      const premium = false;

      const newUser = await User.create({
        username,
        email,
        role,
        password,
        ads_count,
        premium,
      });

      const token = jwt.sign(
        { userId: newUser._id, role, ads_count, premium },
        configs.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
      return res.status(201).json({ user: newUser, token });
    } catch (e) {
      console.error("Error creating user:", e);
      res.status(500).json({ error: "Failed to create user" });
      next(e);
    }
  }
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
        {
          userId: user._id,
          role: user.role,
          ads_count: user.ads_count,
          premium: user.premium,
        },
        configs.JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

      return res.status(200).json({ user, token });
    } catch (e) {
      res.status(500).json({ error: "Login failed" });
      next(e);
    }
  }

  public async logOut(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    res.cookie("token", "", { maxAge: 0 });

    res.redirect("/");
  }
}

export const authController = new AuthController();
