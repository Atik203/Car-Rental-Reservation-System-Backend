import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if error, it will throw an exception
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};
