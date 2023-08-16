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
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const user_enum_1 = require("../enums/user.enum");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    role: {
        type: String,
        enum: Object.values(user_enum_1.UserRole),
        required: true,
    },
    ads_created: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Car" }],
    premium: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    ads_count: { type: Number, default: 0 },
    password: { type: String, required: true, minlength: 6 },
    message: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Message" },
}, {
    versionKey: false,
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    const salt = await bcrypt_1.default.genSalt();
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
