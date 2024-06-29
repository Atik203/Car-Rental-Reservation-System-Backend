import { z } from 'zod';

export const CarValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(3)
      .max(255),
    description: z
      .string({
        required_error: 'Description is required',
      })
      .min(3)
      .max(255),
    color: z
      .string({
        required_error: 'Color is required',
      })
      .min(3)
      .max(255),
    isElectric: z.boolean(),
    pricePerHour: z
      .number({
        required_error: 'Price per hour is required',
      })
      .min(1),
    status: z.enum(['available', 'unavailable']).default('available'),
    features: z
      .array(
        z.string({
          required_error: 'Features is required',
        }),
      )
      .min(1),
    isDeleted: z.boolean().default(false),
  }),
});

export const returnCarValidationSchema = z.object({
  body: z.object({
    bookingId: z
      .string({
        required_error: 'Booking ID is required',
      })
      .min(3)
      .max(255),
    endTime: z
      .string({
        required_error: 'End time is required',
      })
      .min(3)
      .max(255)
      .refine(
        (value) => {
          return value >= '00:00' && value <= '23:59';
        },
        {
          message: 'end time should be in HH:MM format',
        },
      ),
  }),
});
