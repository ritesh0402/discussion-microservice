"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user', // Attach decoded token to req.user
});
exports.default = authMiddleware;
