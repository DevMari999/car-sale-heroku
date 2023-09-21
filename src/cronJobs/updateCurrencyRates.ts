import cron from "node-cron";

import Car from "../models/Car.model";
import {
  convertPrice,
  fetchConversionRates,
} from "../services/currency.service";

export const updateCarCurrencyValues = cron.schedule(
  "0 0 * * * *",
  async () => {
    try {
      const conversionRates = await fetchConversionRates();

      if (!conversionRates) {
        return;
      }

      const cars = await Car.find({});

      for (const car of cars) {
        const { convertedCurrencies } = convertPrice(
          car.price,
          car.currency.toLowerCase(),
          conversionRates,
        );

        car.convertedCurrencies = convertedCurrencies;

        await car.save();
      }
    } catch (error) {}
  },
);
