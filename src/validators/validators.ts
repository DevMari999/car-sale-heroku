import { NextFunction, Request, Response } from "express";

import AppError from "../errors/api.err";

const emailValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const email = req.body.email as string;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  next();
};

const passwordValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const password = req.body.password as string;

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  next();
};

export { emailValidator, passwordValidator };
