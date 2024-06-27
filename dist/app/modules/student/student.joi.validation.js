"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userNameValidationSchema = joi_1.default.object({
    firstName: joi_1.default.string()
        .trim()
        .regex(/^[a-zA-Z]+$/)
        .min(1)
        .max(20)
        .required()
        .messages({
        'string.empty': 'First Name is required',
        'string.pattern.base': 'First Name must contain only letters',
        'string.max': 'First Name must not exceed 20 characters',
    }),
    lastName: joi_1.default.string().trim().alphanum().min(1).max(20).required().messages({
        'string.empty': 'Last Name is required',
        'string.max': 'Last Name must not exceed 20 characters',
    }),
});
const guardianValidationSchema = joi_1.default.object({
    fatherName: joi_1.default.string()
        .trim()
        .alphanum()
        .min(1)
        .max(20)
        .required()
        .messages({
        'string.empty': 'Father Name is required',
        'string.max': 'Father Name must not exceed 20 characters',
    }),
    motherName: joi_1.default.string()
        .trim()
        .alphanum()
        .min(1)
        .max(20)
        .required()
        .messages({
        'string.empty': 'Mother Name is required',
        'string.max': 'Mother Name must not exceed 20 characters',
    }),
});
const studentValidationSchema = joi_1.default.object({
    id: joi_1.default.string().required().messages({ 'string.empty': 'ID is required' }),
    name: userNameValidationSchema.required(),
    gender: joi_1.default.string().valid('male', 'female').required().messages({
        'string.empty': 'Gender is required',
        'any.only': 'Gender must be either male or female',
    }),
    dateOfBirth: joi_1.default.string()
        .required()
        .messages({ 'string.empty': 'Date of Birth is required' }),
    address: joi_1.default.string()
        .required()
        .messages({ 'string.empty': 'Address is required' }),
    phone: joi_1.default.string()
        .required()
        .messages({ 'string.empty': 'Phone number is required' }),
    guardian: guardianValidationSchema.required(),
    profileImage: joi_1.default.string(),
    isActive: joi_1.default.string()
        .valid('active', 'blocked')
        .default('active')
        .required()
        .messages({
        'string.empty': 'Status is required',
        'any.only': 'Status must be either active or blocked',
    }),
    isDeleted: joi_1.default.boolean(),
});
exports.default = studentValidationSchema;
