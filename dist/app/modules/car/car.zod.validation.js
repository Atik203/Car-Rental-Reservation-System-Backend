"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnCarValidationSchema = exports.CarValidationSchema = void 0;
const zod_1 = require("zod");
exports.CarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .min(3)
            .max(255),
        description: zod_1.z
            .string({
            required_error: 'Description is required',
        })
            .min(3)
            .max(255),
        color: zod_1.z
            .string({
            required_error: 'Color is required',
        })
            .min(3)
            .max(255),
        isElectric: zod_1.z.boolean(),
        pricePerHour: zod_1.z
            .number({
            required_error: 'Price per hour is required',
        })
            .min(1),
        status: zod_1.z.enum(['available', 'unavailable']).default('available'),
        features: zod_1.z
            .array(zod_1.z.string({
            required_error: 'Features is required',
        }))
            .min(1),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
exports.returnCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z
            .string({
            required_error: 'Booking ID is required',
        })
            .min(3)
            .max(255),
        endTime: zod_1.z
            .string({
            required_error: 'End time is required',
        })
            .min(3)
            .max(255)
            .refine((value) => {
            return value >= '00:00' && value <= '23:59';
        }, {
            message: 'end time should be in HH:MM format',
        }),
    }),
});
