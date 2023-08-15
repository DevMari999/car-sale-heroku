"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const user_enum_1 = require("../enums/user.enum");
const Car_model_1 = __importDefault(require("../models/Car.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const currency_service_1 = require("../services/currency.service");
class CarController {
    async createCar(req, res, next) {
        try {
            const { brand, model, price, currency, year, region, description } = req.body;
            const supportedCurrencies = ["dollar", "euro", "hryvnia"];
            if (!supportedCurrencies.includes(currency)) {
                return res.status(400).json({ error: "Invalid currency" });
            }
            const conversionRates = await (0, currency_service_1.fetchConversionRates)();
            if (!conversionRates) {
                return res
                    .status(500)
                    .json({ error: "Failed to fetch conversion rates" });
            }
            const { convertedCurrencies, buyRates, saleRates } = (0, currency_service_1.convertPrice)(price, currency, conversionRates);
            const token = req.cookies.token;
            let decodedToken;
            try {
                decodedToken = jsonwebtoken_1.default.verify(token, configs_1.configs.JWT_SECRET);
            }
            catch (error) {
                return res.status(401).json({ error: "Invalid or expired token" });
            }
            const userRole = decodedToken.role;
            const userAds = decodedToken.ads_count;
            const userPremium = decodedToken.premium;
            if (userRole === user_enum_1.UserRole.BUYER) {
                return res
                    .status(403)
                    .json({ error: "Only sellers are allowed to create cars" });
            }
            if (!userPremium && userAds >= 1) {
                return res
                    .status(403)
                    .json({ error: "Free sellers can only create one ad" });
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
            const newToken = jsonwebtoken_1.default.sign({
                userId: updatedUser._id,
                role: userRole,
                ads_count: updatedUser.ads_count,
                premium: userPremium,
            }, configs_1.configs.JWT_SECRET, {
                expiresIn: "1d",
            });
            res.cookie("token", newToken, { maxAge: 3600000, httpOnly: true });
            return res.status(201).json({ car: newCar });
        }
        catch (e) {
            res.status(500).json({ error: "Failed to create car" });
            next(e);
        }
    }
    async getAllCars(req, res, next) {
        try {
            const cars = await Car_model_1.default.find();
            const usersMap = new Map();
            await Promise.all(cars.map(async (car) => {
                if (car.created_by && !usersMap.has(car.created_by.toString())) {
                    const user = await User_model_1.default.findById(car.created_by);
                    usersMap.set(car.created_by.toString(), user);
                }
            }));
            res.render("allCars", { cars, usersMap });
        }
        catch (error) {
            next(error);
        }
    }
    async getCarById(req, res, next) {
        try {
            const carId = req.params.carId;
            const car = await Car_model_1.default.findById(carId).populate("created_by");
            if (!car) {
                res.status(404).json({ error: "Car not found" });
                return;
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
            const oneWeekAgoTimestamp = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
            const oneMonthAgoTimestamp = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
            const pastWeekViews = car.viewEvents.filter((event) => event.timestamp.getTime() >= oneWeekAgoTimestamp).length;
            const pastMonthViews = car.viewEvents.filter((event) => event.timestamp.getTime() >= oneMonthAgoTimestamp).length;
            const allCars = await Car_model_1.default.find();
            const averagePriceByAll = allCars.reduce((total, currentCar) => total + currentCar.price, 0) /
                allCars.length;
            const carsByRegion = await Car_model_1.default.find({ region: car.region });
            const averagePriceByRegion = carsByRegion.reduce((total, currentCar) => total + currentCar.price, 0) / carsByRegion.length;
            res.render("each_ad", {
                car,
                usersMap,
                totalViews,
                pastWeekViews,
                pastMonthViews,
                averagePriceByAll,
                averagePriceByRegion,
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch car" });
            next(error);
        }
    }
    async deleteCarById(req, res, next) {
        try {
            const carId = req.params.carId;
            const deletedCar = await Car_model_1.default.findByIdAndDelete(carId);
            if (!deletedCar) {
                res.status(404).json({ error: "Car not found" });
                return;
            }
            res.redirect("/cars");
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete car" });
            next(error);
        }
    }
}
exports.carController = new CarController();
