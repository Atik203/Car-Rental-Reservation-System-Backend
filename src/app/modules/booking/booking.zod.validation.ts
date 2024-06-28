import { z } from 'zod';

export const createBookingValidationSchema = z.object({
  body: z.object({
    carId: z
      .string({
        required_error: 'Car ID is required',
      })
      .min(2),
    date: z
      .string({
        required_error: 'Date is required',
      })
      .refine(
        (value) => {
          return value.match(
            /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/,
          );
        },
        {
          message: 'Date should be in the format YYYY-MM-DD',
        },
      ),
    startTime: z
      .string({
        required_error: 'Start time is required',
      })
      .min(1)
      .refine(
        (value) => {
          return value >= '00:00' && value <= '23:59';
        },
        {
          message: 'Start time should be in the format HH:MM',
        },
      ),
  }),
});
