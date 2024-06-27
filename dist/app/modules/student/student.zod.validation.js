"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userNameValidationSchemaZod = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(20, 'First Name must not exceed 20 characters'),
    lastName: zod_1.z
        .string()
        .trim()
        .max(20, 'Last Name must not exceed 20 characters'),
});
const guardianValidationSchemaZod = zod_1.z.object({
    fatherName: zod_1.z.string().max(20, 'Father Name must not exceed 20 characters'),
    motherName: zod_1.z
        .string()
        .trim()
        .max(20, 'Mother Name must not exceed 20 characters'),
});
const studentValidationSchemaZod = zod_1.z.object({
    id: zod_1.z.string(),
    name: userNameValidationSchemaZod,
    gender: zod_1.z.enum(['male', 'female'], {
        message: 'Value must be male or female',
    }),
    dateOfBirth: zod_1.z.string(),
    address: zod_1.z.string(),
    guardian: guardianValidationSchemaZod,
    profileImage: zod_1.z.string().optional(),
    isActive: zod_1.z.enum(['active', 'blocked']).default('active'),
    phone: zod_1.z.string(),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
exports.default = studentValidationSchemaZod;
