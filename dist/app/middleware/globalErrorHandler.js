"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../Errors/AppError"));
const handleCastError_1 = __importDefault(require("../Errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../Errors/handleDuplicateError"));
const handleValidationError_1 = __importDefault(require("../Errors/handleValidationError"));
const handleZodError_1 = __importDefault(require("../Errors/handleZodError"));
/* eslint-disable @typescript-eslint/no-unused-vars */
const globalErrorHandler = (error, req, res, 
// eslint-disable-next-line no-unused-vars
next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorMessages = [
        {
            path: '',
            message: 'Internal Server Error',
        },
    ];
    if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof mongoose_1.default.Error.ValidationError) {
        const simplifiedError = (0, handleValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof mongoose_1.default.Error.CastError) {
        const simplifiedError = (0, handleCastError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
        errorMessages = [
            {
                path: '',
                message,
            },
        ];
    }
    else if (error instanceof Error) {
        message = error.message;
        errorMessages = [
            {
                path: '',
                message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        // statusCode,
        message,
        errorMessages,
        stack: config_1.default.NODE_ENV === 'development' ? error.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
