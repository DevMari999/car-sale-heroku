import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import { UserRole } from "../enums/user.enum";

export const checkRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, configs.JWT_SECRET) as {
        role: UserRole;
      };

      if (decoded.role === role) {
        next();
      } else {
        res.status(403).json({ msg: "Access denied" });
      }
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};
