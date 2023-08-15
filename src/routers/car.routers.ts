import express from "express";

import { carService } from "../services/car.service";

const router = express.Router();

router.post("/create-car", carService.createCar);
router.get("/:carId", carService.getCarById);
router.delete("/:carId", carService.deleteCarById);
export default router;
