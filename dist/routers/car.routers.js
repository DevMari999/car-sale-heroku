"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carRoutes = void 0;
const express_1 = require("express");
const car_controller_1 = require("../controller/car.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const carRoutes = (0, express_1.Router)();
exports.carRoutes = carRoutes;
carRoutes.post("/new-car", auth_middleware_1.authMiddleware, car_controller_1.carController.createCar);
