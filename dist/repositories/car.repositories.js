"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarRepository = void 0;
const Car_model_1 = __importDefault(require("../models/Car.model"));
class CarRepository {
    static async getAveragePriceOfAllCars() {
        const allCars = await Car_model_1.default.find();
        return (allCars.reduce((total, currentCar) => total + currentCar.price, 0) /
            allCars.length);
    }
    static async getAveragePriceByRegion(region) {
        const carsByRegion = await Car_model_1.default.find({ region });
        return (carsByRegion.reduce((total, currentCar) => total + currentCar.price, 0) /
            carsByRegion.length);
    }
    static async getPastWeekViews(viewEvents) {
        const oneWeekAgoTimestamp = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
        return viewEvents.filter((event) => event.timestamp.getTime() >= oneWeekAgoTimestamp).length;
    }
    static async getPastMonthViews(viewEvents) {
        const oneMonthAgoTimestamp = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
        return viewEvents.filter((event) => event.timestamp.getTime() >= oneMonthAgoTimestamp).length;
    }
}
exports.CarRepository = CarRepository;
