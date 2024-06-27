import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../Errors/AppError';
import handleCastError from '../Errors/handleCastError';
import handleDuplicateError from '../Errors/handleDuplicateError';
import handleValidationError from '../Errors/handleValidationError';
import handleZodError from '../Errors/handleZodError';
import { TErrorSources } from '../interface/error';

/* eslint-disable @typescript-eslint/no-unused-vars */

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  // eslint-disable-next-line no-unused-vars
  next,
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Internal Server Error',
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof mongoose.Error.ValidationError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof mongoose.Error.CastError) {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [
      {
        path: '',
        message,
      },
    ];
  } else if (error instanceof Error) {
    message = error.message;
    errorSources = [
      {
        path: '',
        message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? error.stack : null,
  });
};
