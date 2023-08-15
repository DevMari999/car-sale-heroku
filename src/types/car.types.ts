import mongoose, { Document } from "mongoose";

export interface ICar extends Document {
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  currency: string;
  created_by: mongoose.Types.ObjectId;
  views: number;
  active: boolean;
  region: string;
  viewEvents: { timestamp: Date }[];
  convertedCurrencies: {
    dollar: number;
    euro: number;
    hryvnia: number;
  };
  currencyRate: {
    dollarBuy: string;
    dollarSale: string;
    euroBuy: string;
    euroSale: string;
  };
}
