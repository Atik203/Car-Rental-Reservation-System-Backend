"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists in the database
    if (!(yield user_model_1.User.isUserExistByCustomId(payload.id))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // check if user is deleted
    if (yield user_model_1.User.isUserDeleted(payload.id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is deleted');
    }
    // check if user is blocked
    if (yield user_model_1.User.isUserBlocked(payload.id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is blocked');
    }
    // Check if the password is correct
    const user = yield user_model_1.User.isUserPasswordMatched(payload.id, payload.password);
    // create jwt token
    const jwtPayload = {
        id: user.id,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiration);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expiration);
    return {
        accessToken,
        needsPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
        refreshToken,
    };
});
const changePasswordService = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists in the database
    if (!(yield user_model_1.User.isUserExistByCustomId(userData.id))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // check if user is deleted
    if (yield user_model_1.User.isUserDeleted(userData.id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is deleted');
    }
    // check if user is blocked
    if (yield user_model_1.User.isUserBlocked(userData.id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is blocked');
    }
    // Check if the password is correct
    const user = yield user_model_1.User.isUserPasswordMatched(userData.id, payload.oldPassword);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Old password is incorrect');
    }
    // hash the new password
    const newPassword = yield bcrypt_1.default.hashSync(payload.newPassword, Number(config_1.default.bcrypt_salt));
    // update the user password
    yield user_model_1.User.findOneAndUpdate({
        id: userData.id,
        role: userData.role,
    }, {
        password: newPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    }, {
        new: true,
    });
    return null;
});
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // verify token
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { id, iat } = decoded;
    // Check if the user exists in the database
    if (!(yield user_model_1.User.isUserExistByCustomId(id))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // check if user is deleted
    if (yield user_model_1.User.isUserDeleted(id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is deleted');
    }
    // check if user is blocked
    if (yield user_model_1.User.isUserBlocked(id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is blocked');
    }
    // check if the password was changed after the token was issued
    const user = yield user_model_1.User.findOne({ id });
    if ((user === null || user === void 0 ? void 0 : user.passwordChangedAt) &&
        (yield user_model_1.User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat))) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Password was changed. Please login again');
    }
    // create jwt token
    const jwtPayload = {
        id: decoded.id,
        role: decoded.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiration);
    return {
        accessToken,
    };
});
exports.authService = {
    loginUserService,
    changePasswordService,
    refreshTokenService,
};
