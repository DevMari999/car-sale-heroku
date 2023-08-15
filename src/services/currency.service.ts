import axios from "axios";

import { ConversionRate } from "../types/conversion.types";

export const fetchConversionRates = async () => {
  try {
    const response = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11",
    );
    const conversionRates: ConversionRate[] = response.data;
    return conversionRates;
  } catch (error) {
    console.error("Error fetching conversion rates:", error);
    return null;
  }
};

export const convertPrice = (
  price: number,
  currency: string,
  conversionRates: ConversionRate[],
): {
  convertedCurrencies: {
    dollar: number;
    euro: number;
    hryvnia: number;
  };
  buyRates: { [key: string]: number };
  saleRates: { [key: string]: number };
} => {
  const buyRates: { [key: string]: number } = {};
  const saleRates: { [key: string]: number } = {};

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
  } else if (currency === "euro") {
    convertedCurrencies = {
      dollar: (price * buyRates["EUR"]) / saleRates["USD"],
      euro: price,
      hryvnia: price * buyRates["EUR"],
    };
  } else if (currency === "hryvnia") {
    convertedCurrencies = {
      dollar: price / saleRates["USD"],
      euro: price / saleRates["EUR"],
      hryvnia: price,
    };
  } else {
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
