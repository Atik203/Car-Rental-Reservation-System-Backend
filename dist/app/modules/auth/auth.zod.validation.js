"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidationSchema = exports.changePasswordValidationSchema = exports.loginValidationSchema = void 0;
const zod_1 = require("zod");
exports.loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'id is required',
        })
            .min(2, {
            message: 'id must be at least 4 characters long',
        })
            .max(20, {
            message: 'id must be at most 20 characters long',
        }),
        password: zod_1.z
            .string({
            required_error: 'password is required',
        })
            .min(6, {
            message: 'password must be at least 6 characters long',
        })
            .max(50, {
            message: 'password must be at most 50 characters long',
        }),
    }),
});
exports.changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z
            .string({
            required_error: 'old password is required',
        })
            .min(6, {
            message: 'password must be at least 6 characters long',
        })
            .max(50, {
            message: 'password must be at most 50 characters long',
        }),
        newPassword: zod_1.z
            .string({
            required_error: 'new password is required',
        })
            .min(6, {
            message: 'password must be at least 6 characters long',
        })
            .max(50, {
            message: 'password must be at most 50 characters long',
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
