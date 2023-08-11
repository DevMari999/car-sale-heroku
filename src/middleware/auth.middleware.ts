import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import { UserRole } from "../enums/user.enum";

declare module "express-serve-static-core" {
  interface Request {
    userRole: UserRole;
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, configs.JWT_SECRET) as {
      userId: string;
      role: UserRole;
    };

    req.userRole = decoded.role; // Set the user's role as a custom property
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
