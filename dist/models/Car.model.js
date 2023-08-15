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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const viewEventSchema = new mongoose_1.Schema({
    timestamp: { type: Date, default: Date.now },
}, { _id: false });
const carSchema = new mongoose_1.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    views: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    region: { type: String, required: true },
    created_by: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    viewEvents: [viewEventSchema],
    convertedCurrencies: {
        dollar: { type: Number },
        euro: { type: Number },
        hryvnia: { type: Number },
    },
    currencyRate: {
        dollarBuy: { type: String },
        dollarSale: { type: String },
        euroBuy: { type: String },
        euroSale: { type: String },
    },
}, {
    versionKey: false,
    timestamps: true,
});
const Car = mongoose_1.default.model("Car", carSchema);
exports.default = Car;
