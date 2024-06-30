import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../Errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { catchAsync } from '../utils/catchAsync';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // if error, it will throw an exception

    // Bearer token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      // throw new AppError(
      //   httpStatus.UNAUTHORIZED,
      //   'You have no access to this route',
      // );
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: 'false',
        message: 'You have no access to this route',
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, email } = decoded;

    // Check if the user exists in the database
    if (!(await User.isUserExistByEmail(email))) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      // throw new AppError(
      //   httpStatus.UNAUTHORIZED,
      //   'You have no access to this route',
      // );
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: 'false',
        message: 'You have no access to this route',
      });
    }

    req.user = decoded;

    next();
  });
};
