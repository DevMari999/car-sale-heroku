import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
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
      const { brand, model, price, currency, year } = req.body;

      const token = req.cookies.token;

      let decodedToken: { userId: string; role: UserRole };
      try {
        decodedToken = jwt.verify(token, configs.JWT_SECRET) as {
          userId: string;
          role: UserRole;
        };
      } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const userRole = decodedToken.role;

      if (userRole !== UserRole.SELLER) {
        return res
          .status(403)
          .json({ error: "Only sellers are allowed to create cars" });
      }

      const newCar = await Car.create({ brand, model, price, currency, year });
      return res.status(201).json({ car: newCar });
    } catch (e) {
      res.status(500).json({ error: "Failed to create car" });
      next(e);
    }
  }

  public async getAllCars(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cars = await Car.find();
      res.render("allCars", { cars });
    } catch (error) {
      next(error);
    }
  }
}

export const carController = new CarController();
