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
};
