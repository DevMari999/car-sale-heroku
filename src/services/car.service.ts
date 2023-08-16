import { UserRole } from "../enums/user.enum";
import Car from "../models/Car.model";
import User from "../models/User.model";
import { CarRepository } from "../repositories/car.repositories";
import { ICar } from "../types/car.types";
import { ConversionRate } from "../types/conversion.types";
import { convertPrice, fetchConversionRates } from "./currency.service";

class CarService {
  public async createCar(body: any, decodedToken: any): Promise<ICar | string> {
    const { brand, model, price, currency, year, region, description } = body;
    const supportedCurrencies = ["dollar", "euro", "hryvnia"];

    if (!supportedCurrencies.includes(currency)) {
      return "Invalid currency";
    }

    const conversionRates: ConversionRate[] = await fetchConversionRates();

    if (!conversionRates) {
      return "Failed to fetch conversion rates";
    }

    const { convertedCurrencies, buyRates, saleRates } = convertPrice(
      price,
      currency,
      conversionRates,
    );

    const userRole = decodedToken.role;
    const userAds = decodedToken.ads_count;
    const userPremium = decodedToken.premium;

    if (userRole === UserRole.BUYER) {
      return "Only sellers are allowed to create cars";
    }

    if (!userPremium && userAds >= 1) {
      return "Free sellers can only create one ad";
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
      convertedCurrencies,
      currencyRate: {
        dollarBuy: buyRates["USD"].toString(),
        dollarSale: saleRates["USD"].toString(),
        euroBuy: buyRates["EUR"].toString(),
        euroSale: saleRates["EUR"].toString(),
      },
    });

    await User.findByIdAndUpdate(
      decodedToken.userId,
      {
        $inc: { ads_count: 1 },
        $push: { ads_created: newCar._id },
      },
      { new: true },
    );

    return newCar;
  }

  public async getAllCars(): Promise<{
    cars: any[];
    usersMap: Map<string, any>;
  }> {
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

    return { cars, usersMap };
  }

  public async getCarById(carId: string): Promise<any> {
    const car = await Car.findById(carId).populate("created_by");

    if (!car) {
      return "Car not found";
    }

    car.views += 1;
    car.viewEvents.push({ timestamp: new Date() });
    await car.save();

    const usersMap = new Map<string, any>();
    if (car.created_by) {
      const user = await User.findById(car.created_by);
      usersMap.set(car.created_by.toString(), user);
    }

    const totalViews = car.views;
    const pastWeekViews = await CarRepository.getPastWeekViews(car.viewEvents);
    const pastMonthViews = await CarRepository.getPastMonthViews(
      car.viewEvents,
    );
    const averagePriceByAll = await CarRepository.getAveragePriceOfAllCars();
    const averagePriceByRegion = await CarRepository.getAveragePriceByRegion(
      car.region,
    );

    return {
      car,
      usersMap,
      totalViews,
      pastWeekViews,
      pastMonthViews,
      averagePriceByAll,
      averagePriceByRegion,
    };
  }

  public async deleteCarById(carId: string): Promise<string | void> {
    const deletedCar = await Car.findByIdAndDelete(carId);

    if (!deletedCar) {
      return "Car not found";
    }
  }
}

export const carService = new CarService();
