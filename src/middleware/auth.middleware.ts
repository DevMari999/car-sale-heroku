import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

import { configs } from "../configs/configs";
import User from "../models/User.model";

interface DecodedToken extends JwtPayload {
  id: string;
}

const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token: string | undefined = req.cookies.token;

  res.locals.user = null;

  if (!token) {
    next();
    return;
  }

  try {
    const decodedToken = jwt.verify(token, configs.JWT_SECRET) as DecodedToken;

    const userId = new mongoose.Types.ObjectId(decodedToken.userId);
    const user = await User.findById(userId);

    res.locals.user = user;
  } catch (error) {
  } finally {
    next();
  }
};

export { checkUser };
