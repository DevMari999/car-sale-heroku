import express from "express";

import { carController } from "../controller/car.controller";

const router = express.Router();

router.post("/create-car", carController.createCar);
router.get("/all-cars", carController.getAllCars);
export default router;
