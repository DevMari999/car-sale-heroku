import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import { UserRole } from "../enums/user.enum";
import Car from "../models/Car.model";
import User from "../models/User.model";
import { ICar } from "../types/car.types";
import { IUser } from "../types/user.types";

class CarController {
  public async createCar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar>> {
    try {
      const { brand, model, price, currency, year, region, description } =
        req.body;

      const token = req.cookies.token;

      let decodedToken: {
        userId: string;
        role: UserRole;
        ads_count: number;
        premium: boolean;
      };
      try {
        decodedToken = jwt.verify(token, configs.JWT_SECRET) as {
          userId: string;
          role: UserRole;
          ads_count: number;
          premium: boolean;
        };
      } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const userRole = decodedToken.role;
      const userAds = decodedToken.ads_count;
      const userPremium = decodedToken.premium;

      if (userRole === UserRole.BUYER) {
        return res
          .status(403)
          .json({ error: "Only sellers are allowed to create cars" });
      }

      if (!userPremium && userAds >= 1) {
        return res
          .status(403)
          .json({ error: "Free sellers can only create one ad" });
      }

      const newCar = await Car.create({
        brand,
        model,
        price,
        currency,
        year,
        created_by: decodedToken.userId,
        region,
        description,
      });

      const updatedUser = await User.findByIdAndUpdate(
        decodedToken.userId,
        {
          $inc: { ads_count: 1 },
          $push: { ads_created: newCar._id },
        },
        { new: true },
      );

      const newToken = jwt.sign(
        {
          userId: updatedUser._id,
          role: userRole,
          ads_count: updatedUser.ads_count,
          premium: userPremium,
        },
        configs.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      res.cookie("token", newToken, { maxAge: 3600000, httpOnly: true });

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

      const usersMap = new Map();
      await Promise.all(
        cars.map(async (car) => {
          if (car.created_by && !usersMap.has(car.created_by.toString())) {
            const user = await User.findById(car.created_by);
            usersMap.set(car.created_by.toString(), user);
          }
        }),
      );

      res.render("allCars", { cars, usersMap });
    } catch (error) {
      next(error);
    }
  }
  public async getCarById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const carId = req.params.carId;
      const car = await Car.findById(carId).populate("created_by");

      if (!car) {
        res.status(404).json({ error: "Car not found" });
        return;
      }

      car.views += 1;
      car.viewEvents.push({ timestamp: new Date() });
      await car.save();

      const usersMap = new Map<string, IUser>();
      if (car.created_by) {
        const user = await User.findById(car.created_by);
        usersMap.set(car.created_by.toString(), user);
      }

      const totalViews = car.views;
      const oneWeekAgoTimestamp =
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
      const oneMonthAgoTimestamp =
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000;

      const pastWeekViews = car.viewEvents.filter(
        (event) => event.timestamp.getTime() >= oneWeekAgoTimestamp,
      ).length;

      const pastMonthViews = car.viewEvents.filter(
        (event) => event.timestamp.getTime() >= oneMonthAgoTimestamp,
      ).length;

      // Query to calculate average price by all
      const allCars = await Car.find();
      const averagePriceByAll =
        allCars.reduce((total, currentCar) => total + currentCar.price, 0) /
        allCars.length;

      // Query to calculate average price by region
      const carsByRegion = await Car.find({ region: car.region });
      const averagePriceByRegion =
        carsByRegion.reduce(
          (total, currentCar) => total + currentCar.price,
          0,
        ) / carsByRegion.length;

      res.render("each_ad", {
        car,
        usersMap,
        totalViews,
        pastWeekViews,
        pastMonthViews,
        averagePriceByAll,
        averagePriceByRegion,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch car" });
      next(error);
    }
  }

  public async deleteCarById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const carId = req.params.carId;
      const deletedCar = await Car.findByIdAndDelete(carId);

      if (!deletedCar) {
        res.status(404).json({ error: "Car not found" });
        return;
      }

      res.redirect("/cars");
    } catch (error) {
      res.status(500).json({ error: "Failed to delete car" });
      next(error);
    }
  }
}

export const carController = new CarController();
