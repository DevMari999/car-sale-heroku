"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carService = void 0;
const user_enum_1 = require("../enums/user.enum");
const api_err_1 = __importDefault(require("../errors/api.err"));
const Car_model_1 = __importDefault(require("../models/Car.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const car_repositories_1 = require("../repositories/car.repositories");
const currency_service_1 = require("./currency.service");
class CarService {
    async createCar(body, decodedToken) {
        const { brand, model, price, currency, year, region, description } = body;
        const supportedCurrencies = ["dollar", "euro", "hryvnia"];
        if (!supportedCurrencies.includes(currency)) {
            throw new api_err_1.default("Invalid currency", 400);
        }
        const conversionRates = await (0, currency_service_1.fetchConversionRates)();
        if (!conversionRates) {
            throw new api_err_1.default("Failed to fetch conversion rates", 500);
        }
        const { convertedCurrencies, buyRates, saleRates } = (0, currency_service_1.convertPrice)(price, currency, conversionRates);
        const userRole = decodedToken.role;
        const userAds = decodedToken.ads_count;
        const userPremium = decodedToken.premium;
        if (userRole === user_enum_1.UserRole.BUYER) {
            throw new api_err_1.default("Only sellers are allowed to create cars", 403);
        }
        if (!userPremium && userAds >= 1) {
            throw new api_err_1.default("Free sellers can only create one ad", 403);
        }
        const newCar = await Car_model_1.default.create({
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
        const updatedUser = await User_model_1.default.findByIdAndUpdate(decodedToken.userId, {
            $inc: { ads_count: 1 },
            $push: { ads_created: newCar._id },
        }, { new: true });
        return { car: newCar, updatedUser };
    }
    async getAllCars() {
        const cars = await Car_model_1.default.find();
        const usersMap = new Map();
        await Promise.all(cars.map(async (car) => {
            if (car.created_by && !usersMap.has(car.created_by.toString())) {
                const user = await User_model_1.default.findById(car.created_by);
                usersMap.set(car.created_by.toString(), user);
            }
        }));
        return { cars, usersMap };
    }
    async getCarById(carId) {
        const car = await Car_model_1.default.findById(carId).populate("created_by");
        if (!car) {
            return "Car not found";
        }
        car.views += 1;
        car.viewEvents.push({ timestamp: new Date() });
        await car.save();
        const usersMap = new Map();
        if (car.created_by) {
            const user = await User_model_1.default.findById(car.created_by);
            usersMap.set(car.created_by.toString(), user);
        }
        const totalViews = car.views;
        const pastWeekViews = await car_repositories_1.CarRepository.getPastWeekViews(car.viewEvents);
        const pastMonthViews = await car_repositories_1.CarRepository.getPastMonthViews(car.viewEvents);
        const averagePriceByAll = await car_repositories_1.CarRepository.getAveragePriceOfAllCars();
        const averagePriceByRegion = await car_repositories_1.CarRepository.getAveragePriceByRegion(car.region);
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
    async deleteCarById(carId) {
        const deletedCar = await Car_model_1.default.findByIdAndDelete(carId);
        if (!deletedCar) {
            return "Car not found";
        }
    }
}
exports.carService = new CarService();
