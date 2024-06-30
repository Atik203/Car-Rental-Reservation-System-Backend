import { Request, Response } from 'express';
export const routeNotFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not found',
    // errorMessages: [
    //   {
    //     path: `${config.base_url}${req.originalUrl}`,
    //     message: 'Route not found',
    //   },
    // ],
  });
};
