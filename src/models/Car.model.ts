import mongoose, { Schema } from "mongoose";

import { ICar } from "../types/car.types";

const carSchema = new Schema<ICar>({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
});

const Car = mongoose.model<ICar>("Car", carSchema);

export default Car;
