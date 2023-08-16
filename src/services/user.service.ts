import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import { UserRole } from "../enums/user.enum";
import Message from "../models/Message.model";
import User from "../models/User.model";
import { IUser } from "../types/user.types";

export class UserService {
  static verifyToken(token: string) {
    return jwt.verify(token, configs.JWT_SECRET);
  }

  static async createUser(data: {
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

  static async upgradeUserToPremium(userId: string): Promise<any> {
    return await User.findByIdAndUpdate(
      userId,
      { premium: true },
      { new: true },
    );
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  static async getUserMessages(userId: string): Promise<any> {
    return await Message.find({ send_to: userId }).populate(
      "send_by",
      "username",
    );
  }

  static createUpdatedToken(userData: any): string {
    return jwt.sign(userData, configs.JWT_SECRET, { expiresIn: "1d" });
  }
}
