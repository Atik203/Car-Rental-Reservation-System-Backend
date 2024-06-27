"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
/* eslint-disable @typescript-eslint/no-unused-vars */
const globalErrorHandler = (error, req, res, next) => {
    if (error instanceof zod_1.z.ZodError) {
        res.status(400).json({
            success: false,
            message: error.errors.map((err) => err.message).join(', '),
        });
    }
    else if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
    }
    else {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
exports.globalErrorHandler = globalErrorHandler;
