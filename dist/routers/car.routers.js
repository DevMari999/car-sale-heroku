"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const car_controller_1 = require("../controller/car.controller");
const router = express_1.default.Router();
router.post("/create-car", car_controller_1.carController.createCar);
router.get("/all-cars", car_controller_1.carController.getAllCars);
exports.default = router;
