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
exports.bookingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const car_model_1 = require("../car/car.model");
const user_model_1 = require("../user/user.model");
const booking_model_1 = require("./booking.model");
const createBookingIntoDB = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    try {
        session.startTransaction();
        // Check if the user exists in the database
        if (!(yield user_model_1.User.isUserExistByEmail(email))) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        // Get the user id
        const user = yield user_model_1.User.findOne({ email }).select('_id');
        const { carId, date, startTime } = payload;
        // Check if the car exists in the database
        if (!(yield car_model_1.Car.isCarExistById(carId))) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
        }
        // Check if the car is available
        if (!(yield car_model_1.Car.isCarAvailable(carId))) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Car is not available');
        }
        // Check if the car is deleted
        if (yield car_model_1.Car.isCarDeleted(carId)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Car is not found');
        }
        // update the car status to unavailable
        yield car_model_1.Car.findByIdAndUpdate(carId, { status: 'unavailable' }, { session });
        // Create the booking data
        const bookingData = {
            car: carId,
            date: date,
            startTime: startTime,
            user: user === null || user === void 0 ? void 0 : user._id,
        };
        // Create the booking
        const booking = yield booking_model_1.Booking.create([bookingData], {
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        const bookingId = booking[0]._id;
        // Get the booking with user and car populated
        const result = yield booking_model_1.Booking.findById(bookingId)
            .populate('user')
            .populate('car');
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error.message);
    }
});
const getAllBookingsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const carId = query.carId;
    if (!(yield car_model_1.Car.isCarExistById(carId))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    if (yield car_model_1.Car.isCarDeleted(carId)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Car is not found');
    }
    const bookingQuery = new QueryBuilder_1.default(booking_model_1.Booking.find().populate('user').populate('car'), query)
        .filterByCarId()
        .filterByCarIdAndDate();
    const result = yield bookingQuery.modelQuery;
    return result;
});
const getMyBookingsFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }).select('_id');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const bookings = yield booking_model_1.Booking.find({ user: user._id })
        .populate('user')
        .populate('car');
    if (bookings.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No bookings found');
    }
    return bookings;
});
exports.bookingService = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    getMyBookingsFromDB,
};
