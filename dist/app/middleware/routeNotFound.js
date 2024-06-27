"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = void 0;
const routeNotFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        error: '',
    });
};
exports.routeNotFound = routeNotFound;
