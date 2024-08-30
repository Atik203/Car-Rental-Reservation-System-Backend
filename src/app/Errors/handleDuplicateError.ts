/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const statusCode = 400;
  const match = error.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const errorMessages: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} already exists`,
    },
  ];

  return {
    message: 'Duplicate value entered',
    statusCode,
    errorMessages,
  };
};

export default handleDuplicateError;
