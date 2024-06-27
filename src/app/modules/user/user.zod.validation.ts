import { z } from 'zod';
// all request format should be in body
const validateFormat = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
  }),
});

export default validateFormat;
