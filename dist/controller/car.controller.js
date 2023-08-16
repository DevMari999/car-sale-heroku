"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCarByIdController = exports.getCarByIdController = exports.getAllCarsController = exports.createCarController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs/configs");
const api_err_1 = __importDefault(require("../errors/api.err"));
const car_service_1 = require("../services/car.service");
const createCarController = async (req, res, next) => {
    try {
        const result = await car_service_1.carService.createCar(req.body, res.locals.decodedToken);
        if (result instanceof Error) {
            throw result;
        }
        const { car, updatedUser } = result;
        const newToken = jsonwebtoken_1.default.sign({
            userId: updatedUser._id,
            role: updatedUser.role,
            ads_count: updatedUser.ads_count,
            premium: updatedUser.premium,
        }, configs_1.configs.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("token", newToken, { maxAge: 3600000, httpOnly: true });
        return res.status(201).json({ car });
    }
    catch (error) {
        if (error instanceof api_err_1.default &&
            error.message === "Only sellers are allowed to create cars") {
            return res.status(error.statusCode).json({ error: error.message });
        }
        next(error);
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
