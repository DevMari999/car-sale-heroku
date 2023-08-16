"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCarCurrencyValues = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Car_model_1 = __importDefault(require("../models/Car.model"));
const currency_service_1 = require("../services/currency.service");
exports.updateCarCurrencyValues = node_cron_1.default.schedule("0 0 * * * *", async () => {
    try {
        const conversionRates = await (0, currency_service_1.fetchConversionRates)();
        if (!conversionRates) {
            console.error("Failed to fetch conversion rates for cron job");
            return;
        }
        const cars = await Car_model_1.default.find({});
        for (const car of cars) {
            const { convertedCurrencies } = (0, currency_service_1.convertPrice)(car.price, car.currency.toLowerCase(), conversionRates);
            car.convertedCurrencies = convertedCurrencies;
            await car.save();
        }
        console.log("Updated all car currency values successfully");
    }
    catch (error) {
        console.error("Error in cron job:", error);
    }
});
