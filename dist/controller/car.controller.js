"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCarByIdController = exports.getCarByIdController = exports.getAllCarsController = exports.createCarController = void 0;
const car_service_1 = require("../services/car.service");
const createCarController = async (req, res, next) => {
    try {
        const result = await car_service_1.carService.createCar(req.body, res.locals.decodedToken);
        if (typeof result === "string") {
            return res.status(400).json({ error: result });
        }
        return res.status(201).json({ car: result });
    }
    catch (e) {
        next(e);
    }
};
exports.createCarController = createCarController;
const getAllCarsController = async (req, res, next) => {
    try {
        const { cars, usersMap } = await car_service_1.carService.getAllCars();
        return res.render("allCars", { cars, usersMap });
    }
    catch (error) {
        return next(error);
    }
};
exports.getAllCarsController = getAllCarsController;
const getCarByIdController = async (req, res, next) => {
    try {
        const result = await car_service_1.carService.getCarById(req.params.carId);
        if (typeof result === "string") {
            res.status(404).json({ error: result });
        }
        return res.render("each_ad", result);
    }
    catch (error) {
        return next(error);
    }
};
exports.getCarByIdController = getCarByIdController;
const deleteCarByIdController = async (req, res, next) => {
    try {
        const result = await car_service_1.carService.deleteCarById(req.params.carId);
        if (result) {
            return res.status(404).json({ error: result });
        }
        res.redirect("/cars");
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCarByIdController = deleteCarByIdController;
