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
  region: string;
  viewEvents: { timestamp: Date }[];
}
