import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import AppError from "../errors/api.err";
import { carService } from "../services/car.service";

export const createCarController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const result = await carService.createCar(
      req.body,
      res.locals.decodedToken,
    );

    if (result instanceof Error) {
      throw result;
    }

    const { car, updatedUser } = result;

    const newToken = jwt.sign(
      {
        userId: updatedUser._id,
        role: updatedUser.role,
        ads_count: updatedUser.ads_count,
        premium: updatedUser.premium,
      },
      configs.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", newToken, { maxAge: 3600000, httpOnly: true });

    return res.status(201).json({ car });
  } catch (error) {
    if (
      error instanceof AppError &&
      error.message === "Only sellers are allowed to create cars"
    ) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    next(error);
  }
};

export const getAllCarsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cars, usersMap } = await carService.getAllCars();
    return res.render("allCars", { cars, usersMap });
  } catch (error) {
    return next(error);
  }
};

export const getCarByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await carService.getCarById(req.params.carId);

    if (typeof result === "string") {
      res.status(404).json({ error: result });
    }

    return res.render("each_ad", result);
  } catch (error) {
    return next(error);
  }
};

export const deleteCarByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const result = await carService.deleteCarById(req.params.carId);

    if (result) {
      return res.status(404).json({ error: result });
    }

    res.redirect("/cars/shop");
  } catch (error) {
    next(error);
  }
};
