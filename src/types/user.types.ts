import { Document } from "mongoose";

import { UserRole } from "../enums/user.enum";

export interface IUser extends Document {
  username: string;
  email: string;
  role: UserRole;
  password: string;
  premium: boolean;
  ads: number;
}
