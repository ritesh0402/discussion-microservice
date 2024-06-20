"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const discussionRoutes_1 = __importDefault(require("./routes/discussionRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/discussions', discussionRoutes_1.default);
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('Discussion Service: MongoDB connected'))
    .catch(err => console.error(err));
exports.default = app;
