import "./cronJobs/updateCurrencyRates";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/configs";
import { getAllCarsController } from "./controller/car.controller";
import globalErrorHandler from "./errors/globalErrorHandler";
import { checkUser } from "./middleware/auth.middleware";
import carRoutes from "./routers/car.routers";
import messageRoutes from "./routers/message.routes";
import userRoutes from "./routers/user.routers";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("*", checkUser);

app.use("/users", userRoutes);
app.use("/cars", carRoutes);
app.use("/messages", messageRoutes);

app.get("/", getAllCarsController);
app.get("/signup", (req, res) => res.render("signup"));
app.get("/login", (req, res) => res.render("login"));
app.get("/create-car", (req, res) => res.render("create_car_ad"));
app.get("/create-manager", (req, res) => res.render("create_manager"));
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  mongoose.connect(configs.DB_URL);
  console.log(`Server has started on PORT ${configs.PORT} 🥸`);
});
