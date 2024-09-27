import { z } from 'zod';

export const reviewValidationSchema = z.object({
  user: z.string().min(1),
  car: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
});
