import cron from "node-cron";

import Car from "../models/Car.model";
import {
  convertPrice,
  fetchConversionRates,
} from "../services/currency.service";

cron.schedule("0 0 * * *", async () => {
  try {
    const conversionRates = await fetchConversionRates();

    if (!conversionRates) {
      console.error("Failed to fetch conversion rates for cron job");
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

    console.log("Updated all car currency values successfully");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
