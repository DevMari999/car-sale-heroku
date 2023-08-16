import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import { UserRole } from "../enums/user.enum";
import Message from "../models/Message.model";
import User from "../models/User.model";
import { IUser } from "../types/user.types";

export class UserService {
  public static verifyToken(token: string) {
    return jwt.verify(token, configs.JWT_SECRET);
  }

  public static async createUser(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<void> {
    await User.create({
      ...data,
      role: UserRole.MANAGER,
      premium: true,
    });
  }

  public static async upgradeUserToPremium(userId: string): Promise<any> {
    return await User.findByIdAndUpdate(
      userId,
      { premium: true },
      { new: true },
    );
  }

  public static async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  public static async getUserMessages(userId: string): Promise<any> {
    return await Message.find({ send_to: userId }).populate(
      "send_by",
      "username",
    );
  }

  public static createUpdatedToken(userData: any): string {
    return jwt.sign(userData, configs.JWT_SECRET, { expiresIn: "1d" });
  }
}
