"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = void 0;
const routeNotFound = (req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Not found',
        // errorSources: [
        //   {
        //     path: `${config.base_url}${req.originalUrl}`,
        //     message: 'Route not found',
        //   },
        // ],
    });
};
exports.routeNotFound = routeNotFound;
