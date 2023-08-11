import { NextFunction, Request, Response } from "express";

import { UserRole } from "../enums/user.enum";
import Car from "../models/Car.model";
import { ICar } from "../types/car.types";

class CarController {
  public async createCar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar>> {
    try {
      const { brand, model, price, currency } = req.body;
      const userRole = req.userRole;

      if (userRole !== UserRole.SELLER) {
        return res
          .status(403)
          .json({ error: "Only sellers are allowed to create cars" });
      }

      const newCar = await Car.create({ brand, model, price, currency });
      return res.status(201).json(newCar);
    } catch (e) {
      res.status(500).json({ error: "Failed to create car" });
      next(e);
    }
  }
}

export const carController = new CarController();
