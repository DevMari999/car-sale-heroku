"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const car_controller_1 = require("../controller/car.controller");
const token_middleware_1 = require("../middleware/token.middleware");
const router = express_1.default.Router();
router.post("/create-car", token_middleware_1.validateTokenMiddleware, car_controller_1.createCarController);
router.get("/", car_controller_1.getAllCarsController);
router.get("/:carId", car_controller_1.getCarByIdController);
router.delete("/:carId", car_controller_1.deleteCarByIdController);
exports.default = router;
