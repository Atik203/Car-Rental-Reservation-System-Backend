import { z } from 'zod';

export const signInValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .min(2, {
        message: 'email must be at least 2 characters long',
      })
      .max(100, {
        message: 'email must be at most 100 characters long',
      }),
    password: z
      .string({
        required_error: 'password is required',
      })
      .min(2, {
        message: 'password must be at least 2 characters long',
      })
      .max(100, {
        message: 'password must be at most 100 characters long',
      }),
  }),
});

export const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'refreshToken is required',
    }),
  }),
});
