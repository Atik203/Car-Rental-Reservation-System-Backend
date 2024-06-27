import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

/* eslint-disable @typescript-eslint/no-unused-vars */

export const globalErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      success: false,
      message: error.errors.map((err) => err.message).join(', '),
    });
  } else if (error instanceof Error) {
    res.status(500).json({ success: false, message: error.message });
  } else {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
