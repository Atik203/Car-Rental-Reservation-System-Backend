"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingValidationSchema = void 0;
const zod_1 = require("zod");
exports.createBookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        carId: zod_1.z
            .string({
            required_error: 'Car ID is required',
        })
            .min(2),
        date: zod_1.z
            .string({
            required_error: 'Date is required',
        })
            .refine((value) => {
            return value.match(/^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/);
        }, {
            message: 'Date should be in the format YYYY-MM-DD',
        }),
        startTime: zod_1.z
            .string({
            required_error: 'Start time is required',
        })
            .min(1)
            .refine((value) => {
            return value >= '00:00' && value <= '23:59';
        }, {
            message: 'Start time should be in the format HH:MM',
        }),
    }),
});
