import mongoose, { Document } from "mongoose";

import { UserRole } from "../enums/user.enum";

export interface IUser extends Document {
  username: string;
  email: string;
  role: UserRole;
  password: string;
  premium: boolean;
  ads_count: number;
  active: boolean;
  ads_created: mongoose.Types.ObjectId[];
  message: mongoose.Types.ObjectId;
}
