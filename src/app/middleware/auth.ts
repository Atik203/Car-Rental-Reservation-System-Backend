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

    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // verify token
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, id, iat } = decoded;

    // Check if the user exists in the database
    if (!(await User.isUserExistByCustomId(id))) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // check if user is deleted

    if (await User.isUserDeleted(id)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted');
    }

    // check if user is blocked

    if (await User.isUserBlocked(id)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked');
    }

    // check if the password was changed after the token was issued

    const user = await User.findOne({ id });

    if (
      user?.passwordChangedAt &&
      (await User.isJWTIssuedBeforePasswordChange(
        user.passwordChangedAt,
        iat as number,
      ))
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Password was changed. Please login again',
      );
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    req.user = decoded;

    next();
  });
};
