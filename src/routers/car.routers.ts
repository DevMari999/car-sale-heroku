import express from "express";

import { carController } from "../controller/car.controller";

const router = express.Router();

router.post("/create-car", carController.createCar);
router.get("/:carId", carController.getCarById);
router.delete("/:carId", carController.deleteCarById);
export default router;
