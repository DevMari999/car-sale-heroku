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
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    ads_created: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
    premium: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    ads_count: { type: Number, default: 0 },
    password: { type: String, required: true, minlength: 6 },
    message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
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
