import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

import { UserRole } from "../enums/user.enum";
import { IUser } from "../types/user.types";

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    premium: { type: Boolean, default: false },
    ads: { type: Number, default: 0 },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const User = mongoose.model<IUser>("User", userSchema);

export default User;
