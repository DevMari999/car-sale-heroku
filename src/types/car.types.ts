import { Document } from "mongoose";

export interface ICar extends Document {
  brand: string;
  model: string;
  year: number;
}
