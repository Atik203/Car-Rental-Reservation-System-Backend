import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const message = 'Invalid ID';
  const statusCode = 400;

  const errorMessages: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return {
    message,
    statusCode,
    errorMessages,
  };
};

export default handleCastError;
