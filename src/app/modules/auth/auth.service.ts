import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../Errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TSignInUser } from './auth.interface';
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

const signInService = async (payload: Partial<TSignInUser>) => {
  // Check if the user exists in the database
  if (!(await User.isUserExistByEmail(payload.email as string))) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the password is correct and get  user
  const user = await User.isUserPasswordMatched(
    payload.email as string,
    payload.password as string,
  );

  // Create a JWT token
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiration as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiration as string,
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
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
  signInService,
};
