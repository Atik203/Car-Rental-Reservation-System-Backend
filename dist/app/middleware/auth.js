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
exports.auth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../Errors/AppError"));
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = require("../utils/catchAsync");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // if error, it will throw an exception
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { role, id, iat } = decoded;
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
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized');
        }
        req.user = decoded;
        next();
    }));
};
exports.auth = auth;
