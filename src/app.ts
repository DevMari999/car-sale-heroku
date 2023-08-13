import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/configs";
import { checkUser } from "./middleware/auth.middleware";
import carRoutes from "./routers/car.routers";
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

app.listen(configs.PORT, () => {
  mongoose.connect(configs.DB_URL);
  console.log(`Server has started on PORT ${configs.PORT} 🥸`);
});

app.get("/", (req, res) => res.render("home"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/login", (req, res) => res.render("login"));
app.get("/create-car", (req, res) => res.render("car"));

app.get("/create-manager", (req, res) => res.render("create_manager"));
