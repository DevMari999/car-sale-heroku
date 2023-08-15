import mongoose, { Schema } from "mongoose";

import { ICar } from "../types/car.types";

const viewEventSchema = new Schema(
  {
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const carSchema = new Schema<ICar>(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    views: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    region: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    viewEvents: [viewEventSchema],
    convertedCurrencies: {
      dollar: { type: Number },
      euro: { type: Number },
      hryvnia: { type: Number },
    },
    currencyRate: {
      dollarBuy: { type: String },
      dollarSale: { type: String },
      euroBuy: { type: String },
      euroSale: { type: String },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Car = mongoose.model<ICar>("Car", carSchema);

export default Car;
