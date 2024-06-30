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
        var _a;
        // Bearer token
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            // throw new AppError(
            //   httpStatus.UNAUTHORIZED,
            //   'You have no access to this route',
            // );
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                success: 'false',
                statusCode: http_status_1.default.UNAUTHORIZED,
                message: 'You have no access to this route',
            });
        }
        // verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { role, email } = decoded;
        // Check if the user exists in the database
        if (!(yield user_model_1.User.isUserExistByEmail(email))) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            // throw new AppError(
            //   httpStatus.UNAUTHORIZED,
            //   'You have no access to this route',
            // );
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                success: 'false',
                statusCode: http_status_1.default.UNAUTHORIZED,
                message: 'You have no access to this route',
            });
        }
        req.user = decoded;
        next();
    }));
};
exports.auth = auth;
