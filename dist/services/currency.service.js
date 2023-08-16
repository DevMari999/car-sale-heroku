"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPrice = exports.fetchConversionRates = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchConversionRates = async () => {
    try {
        const response = await axios_1.default.get("https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11");
        const conversionRates = response.data;
        return conversionRates;
    }
    catch (error) {
        console.error("Error fetching conversion rates:", error);
        return null;
    }
};
exports.fetchConversionRates = fetchConversionRates;
const convertPrice = (price, currency, conversionRates) => {
    const buyRates = {};
    const saleRates = {};
    for (const rate of conversionRates) {
        buyRates[rate.ccy] = parseFloat(rate.buy);
        saleRates[rate.ccy] = parseFloat(rate.sale);
    }
    let convertedCurrencies;
    if (currency === "dollar") {
        convertedCurrencies = {
            dollar: price,
            euro: (price * buyRates["USD"]) / saleRates["EUR"],
            hryvnia: price * buyRates["USD"],
        };
    }
    else if (currency === "euro") {
        convertedCurrencies = {
            dollar: (price * buyRates["EUR"]) / saleRates["USD"],
            euro: price,
            hryvnia: price * buyRates["EUR"],
        };
    }
    else if (currency === "hryvnia") {
        convertedCurrencies = {
            dollar: price / saleRates["USD"],
            euro: price / saleRates["EUR"],
            hryvnia: price,
        };
    }
    else {
        convertedCurrencies = {
            dollar: price,
            euro: price,
            hryvnia: price,
        };
    }
    return {
        convertedCurrencies,
        buyRates,
        saleRates,
    };
};
exports.convertPrice = convertPrice;
