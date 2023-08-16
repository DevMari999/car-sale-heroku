import { NextFunction, Request, Response } from "express";

import AppError from "../errors/api.err";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  } else {
    console.error("Unexpected error:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}
