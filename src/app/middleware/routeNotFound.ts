import { Request, Response } from 'express';
import config from '../config';
export const routeNotFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
    errorSources: [
      {
        path: `${config.base_url}${req.originalUrl}`,
        message: 'Route not found',
      },
    ],
  });
};
