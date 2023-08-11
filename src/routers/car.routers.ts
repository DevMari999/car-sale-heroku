import { Router } from "express";

import { carController } from "../controller/car.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const carRoutes = Router();

carRoutes.post("/new-car", authMiddleware, carController.createCar);
export { carRoutes };
