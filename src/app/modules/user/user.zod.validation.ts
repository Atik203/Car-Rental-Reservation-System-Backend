import { z } from 'zod';

export const signUpValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email(),
    password: z.string().min(4),
    name: z.string().min(3),
    role: z.enum(['admin', 'user']),
    phone: z.string().min(1, {
      message: 'phone number should be minimum 1 characters',
    }),
    address: z.string().min(1),
  }),
});
