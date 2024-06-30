"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpValidationSchema = void 0;
const zod_1 = require("zod");
exports.signUpValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'email is required',
        })
            .email(),
        password: zod_1.z.string().min(6),
        name: zod_1.z.string().min(3),
        role: zod_1.z.enum(['admin', 'user']),
        phone: zod_1.z.string().min(11, {
            message: 'phone number should be 11 digits',
        }),
        address: zod_1.z.string().min(10),
    }),
});
