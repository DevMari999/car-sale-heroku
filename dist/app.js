"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose = __importStar(require("mongoose"));
const configs_1 = require("./configs/configs");
const user_controller_1 = require("./controller/user.controller");
const auth_middleware_1 = require("./middleware/auth.middleware");
const car_routers_1 = require("./routers/car.routers");
const user_routers_1 = __importDefault(require("./routers/user.routers"));
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.set("view engine", "ejs");
app.use("/users", user_routers_1.default);
app.use("/cars", auth_middleware_1.authMiddleware, car_routers_1.carRoutes);
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", user_controller_1.userController.newUser);
app.listen(configs_1.configs.PORT, () => {
    mongoose.connect(configs_1.configs.DB_URL);
    console.log(`Server has started on PORT ${configs_1.configs.PORT} 🥸`);
});
app.get("/", (req, res) => res.render("home"));
