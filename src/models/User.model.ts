import mongoose, { Schema } from "mongoose";

import { UserRole } from "../enums/user.enum";
import { IUser } from "../types/user.types";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
  },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
