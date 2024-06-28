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
    status: z.enum(['available', 'unavailable']),
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
