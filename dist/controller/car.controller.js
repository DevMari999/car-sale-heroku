"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const user_enum_1 = require("../enums/user.enum");
const Car_model_1 = __importDefault(require("../models/Car.model"));
class CarController {
    async createCar(req, res, next) {
        try {
            const { brand, model, price, currency, year } = req.body;
            const token = req.cookies.token;
            let decodedToken;
            try {
                decodedToken = jsonwebtoken_1.default.verify(token, configs_1.configs.JWT_SECRET);
            }
            catch (error) {
                return res.status(401).json({ error: "Invalid or expired token" });
            }
            const userRole = decodedToken.role;
            if (userRole !== user_enum_1.UserRole.SELLER) {
                return res
                    .status(403)
                    .json({ error: "Only sellers are allowed to create cars" });
            }
            const newCar = await Car_model_1.default.create({ brand, model, price, currency, year });
            return res.status(201).json({ car: newCar });
        }
        catch (e) {
            res.status(500).json({ error: "Failed to create car" });
            next(e);
        }
    }
    async getAllCars(req, res, next) {
        try {
            const cars = await Car_model_1.default.find();
            res.render("allCars", { cars });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.carController = new CarController();
