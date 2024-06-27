"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const message = 'Invalid ID';
    const statusCode = 400;
    const errorSources = [
        {
            path: err.path,
            message: err.message,
        },
    ];
    return {
        message,
        statusCode,
        errorSources,
    };
};
exports.default = handleCastError;
