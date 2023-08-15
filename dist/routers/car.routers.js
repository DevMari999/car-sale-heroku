"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const car_service_1 = require("../services/car.service");
const router = express_1.default.Router();
router.post("/create-car", car_service_1.carService.createCar);
router.get("/:carId", car_service_1.carService.getCarById);
router.delete("/:carId", car_service_1.carService.deleteCarById);
exports.default = router;
