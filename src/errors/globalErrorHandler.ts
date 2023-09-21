import { NextFunction, Request, Response } from "express";

import AppError from "../errors/api.err";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errors: {
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    errors: {
      message: "Internal server error",
    },
  });
};

export default globalErrorHandler;
