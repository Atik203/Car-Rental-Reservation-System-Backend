import { z } from 'zod';

export const signUpValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email(),
    password: z.string().min(6),
    name: z.string().min(3),
    role: z.enum(['admin', 'user']),
    phone: z.string().min(11, {
      message: 'phone number should be 11 digits',
    }),
    address: z.string().min(10),
  }),
});
