import express from "express";

import {
  createCarController,
  deleteCarByIdController,
  getAllCarsController,
  getCarByIdController,
} from "../controller/car.controller";
import { validateTokenMiddleware } from "../middleware/token.middleware";

const router = express.Router();

router.post(
  "/create-car",

  validateTokenMiddleware,
  createCarController,
);
router.get("/shop", getAllCarsController);
router.get("/:carId", getCarByIdController);
router.delete("/:carId", deleteCarByIdController);
export default router;
