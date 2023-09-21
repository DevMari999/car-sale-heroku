import { NextFunction, Request, Response } from "express";

import { UserRole } from "../enums/user.enum";
import { UserService } from "../services/user.service";

export class UserController {
  public async createManager(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    const decodedToken = res.locals.decodedToken;

    if (decodedToken.role !== UserRole.ADMINISTRATOR) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      const { username, email, password } = req.body;
      await UserService.createUser({ username, email, password });
      return res.status(201).json({ message: "Manager user created" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create manager user" });
      next(error);
    }
  }

  public async upgradeToPremium(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    const decodedToken = res.locals.decodedToken;

    if (decodedToken.role !== UserRole.SELLER) {
      return res
        .status(403)
        .json({ error: "Only sellers can upgrade to premium" });
    }

    try {
      const updatedUser = await UserService.upgradeUserToPremium(
        decodedToken.userId,
      );
      const updatedToken = UserService.createUpdatedToken({
        userId: updatedUser._id,
        role: updatedUser.role,
        ads_count: updatedUser.ads_count,
        premium: updatedUser.premium,
      });

      res.cookie("token", updatedToken, { maxAge: 3600000, httpOnly: true });
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ error: "Failed to upgrade to premium" });
      next(error);
    }
  }

  public async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    const decodedToken = res.locals.decodedToken;

    try {
      const user = await UserService.getUserById(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const messages = await UserService.getUserMessages(decodedToken.userId);
      res.render("account", { user, messages });
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
      next(error);
    }
  }
}

export const userController = new UserController();
