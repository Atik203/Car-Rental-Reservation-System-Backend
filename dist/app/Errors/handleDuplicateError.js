"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (error) => {
    const statusCode = 400;
    const match = error.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorMessages = [
        {
            path: '',
            message: `${extractedMessage} already exists`,
        },
    ];
    return {
        message: 'Duplicate value entered',
        statusCode,
        errorMessages,
    };
};
exports.default = handleDuplicateError;
