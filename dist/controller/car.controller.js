"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carController = void 0;
const user_enum_1 = require("../enums/user.enum");
const Car_model_1 = __importDefault(require("../models/Car.model"));
class CarController {
    async createCar(req, res, next) {
        try {
            const { brand, model, price, currency } = req.body;
            const userRole = req.userRole;
            if (userRole !== user_enum_1.UserRole.SELLER) {
                return res
                    .status(403)
                    .json({ error: "Only sellers are allowed to create cars" });
            }
            const newCar = await Car_model_1.default.create({ brand, model, price, currency });
            return res.status(201).json(newCar);
        }
        catch (e) {
            res.status(500).json({ error: "Failed to create car" });
            next(e);
        }
    }
}
exports.carController = new CarController();
