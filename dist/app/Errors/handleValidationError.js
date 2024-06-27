"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (error) => {
    const statusCode = 400;
    const message = 'Validation Error';
    const errorSources = Object.values(error.errors).map((value) => {
        return {
            path: value.path,
            message: value.message,
        };
    });
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.default = handleValidationError;
