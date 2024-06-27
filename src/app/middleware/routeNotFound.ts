import { Request, Response } from 'express';

export const routeNotFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: '',
  });
};
