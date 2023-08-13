import { config } from "dotenv";

config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,

  JWT_SECRET: process.env.JWT_SECRET,
};
