import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { authService } from './auth.service';

const signUpUser = catchAsync(async (req, res) => {
  const result = await authService.signUpUserService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: result,
  });
});

const signInUser = catchAsync(async (req, res) => {
  const result = await authService.signInService(req.body);

  const { accessToken, refreshToken, user } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: user,
    token: accessToken,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await authService.refreshTokenService(
    req.cookies.refreshToken,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Token refreshed successfully',
    data: result,
  });
});

export const authController = {
  refreshToken,
  signUpUser,
  signInUser,
};
