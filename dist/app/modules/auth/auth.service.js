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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const signUpUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user already exists in the database
    if (yield user_model_1.User.isUserExistByEmail(payload.email)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists');
    }
    // Create a new user
    const user = yield user_model_1.User.create(payload);
    // eslint-disable-next-line no-unused-vars
    const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
    return userWithoutPassword;
});
const signInService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists in the database
    if (!(yield user_model_1.User.isUserExistByEmail(payload.email))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found 1');
    }
    // Check if the password is correct and get  user
    const user = yield user_model_1.User.isUserPasswordMatched(payload.email, payload.password);
    // Create a JWT token
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiration);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expiration);
    return {
        user,
        accessToken,
        refreshToken,
    };
});
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // verify token
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    // Check if the user exists in the database
    if (!(yield user_model_1.User.isUserExistByEmail(email))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // create jwt token
    const jwtPayload = {
        email: decoded.email,
        role: decoded.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiration);
    return {
        accessToken,
    };
});
exports.authService = {
    refreshTokenService,
    signUpUserService,
    signInService,
};
