"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middleware/validateRequest");
const user_zod_validation_1 = require("../user/user.zod.validation");
const auth_controller_1 = require("./auth.controller");
const auth_zod_validation_1 = require("./auth.zod.validation");
const router = express_1.default.Router();
router.post('/signup', (0, validateRequest_1.validateRequest)(user_zod_validation_1.signUpValidationSchema), auth_controller_1.authController.signUpUser);
router.post('/signin', (0, validateRequest_1.validateRequest)(auth_zod_validation_1.signInValidationSchema), auth_controller_1.authController.signInUser);
router.post('/refresh-token', (0, validateRequest_1.validateRequest)(auth_zod_validation_1.refreshTokenValidationSchema), auth_controller_1.authController.refreshToken);
exports.authRoutes = router;
