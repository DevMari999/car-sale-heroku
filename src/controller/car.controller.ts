import { NextFunction, Request, Response } from "express";

import { carService } from "../services/car.service";

export const createCarController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const result = await carService.createCar(
      req.body,
      res.locals.decodedToken,
    );

    if (typeof result === "string") {
      return res.status(400).json({ error: result });
    }

    return res.status(201).json({ car: result });
  } catch (e) {
    next(e);
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

    res.redirect("/cars");
  } catch (error) {
    next(error);
  }
};
