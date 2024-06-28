import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    car: z
      .string({
        required_error: 'Car ID is required',
      })
      .min(2),
    date: z
      .string({
        required_error: 'Date is required',
      })
      .min(1),
    startTime: z
      .string({
        required_error: 'Start time is required',
      })
      .min(1),
  }),
});
