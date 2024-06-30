"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = void 0;
const config_1 = __importDefault(require("../config"));
const routeNotFound = (req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Route not found',
        errorSources: [
            {
                path: `${config_1.default.base_url}${req.originalUrl}`,
                message: 'Route not found',
            },
        ],
    });
};
exports.routeNotFound = routeNotFound;
