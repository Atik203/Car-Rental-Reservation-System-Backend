"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidationSchema = exports.signInValidationSchema = void 0;
const zod_1 = require("zod");
exports.signInValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'email is required',
        })
            .min(2, {
            message: 'email must be at least 2 characters long',
        })
            .max(100, {
            message: 'email must be at most 100 characters long',
        }),
        password: zod_1.z
            .string({
            required_error: 'password is required',
        })
            .min(2, {
            message: 'password must be at least 2 characters long',
        })
            .max(100, {
            message: 'password must be at most 100 characters long',
        }),
    }),
});
exports.refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'refreshToken is required',
        }),
    }),
});
