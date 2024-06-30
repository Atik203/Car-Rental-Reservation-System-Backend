"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const validateRequest_1 = require("../../middleware/validateRequest");
const user_constant_1 = require("../user/user.constant");
const booking_controller_1 = require("./booking.controller");
const booking_zod_validation_1 = require("./booking.zod.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.auth)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.validateRequest)(booking_zod_validation_1.createBookingValidationSchema), booking_controller_1.bookingController.createBooking);
router.get('/', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), booking_controller_1.bookingController.getAllBookings);
router.get('/my-bookings', (0, auth_1.auth)(user_constant_1.USER_ROLE.user), booking_controller_1.bookingController.getMyBookings);
exports.bookingRoutes = router;
