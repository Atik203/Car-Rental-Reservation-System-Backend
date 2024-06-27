import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../Errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { createToken } from './auth.utils';

const signUpUserService = async (payload: Partial<TUser>) => {
  // Check if the user already exists in the database
  if (await User.isUserExistByEmail(payload.email as string)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  // Create a new user
  const user = await User.create(payload);

  return user;
};

const refreshTokenService = async (token: string) => {
  // verify token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { email } = decoded;

  // Check if the user exists in the database
  if (!(await User.isUserExistByEmail(email))) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // check if user is deleted

  if (await User.isUserDeleted(email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted');
  }

  // create jwt token

  const jwtPayload = {
    email: decoded.email,
    role: decoded.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiration as string,
  );

  return {
    accessToken,
  };
};

export const authService = {
  refreshTokenService,
  signUpUserService,
};
