import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import User from "../models/User.model";
import { IUser } from "../types/user.types";

class AuthService {
  async newUser(userData: any): Promise<{ user: IUser; token: string }> {
    const { username, email, role, password } = userData;

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

    return { user: newUser, token };
  }

  async loginUser(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    const { email, password } = credentials;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
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

    return { user, token };
  }

  logoutUser(): string {
    return "/";
  }
}

export const authService = new AuthService();
