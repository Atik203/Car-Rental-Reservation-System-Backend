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
exports.carService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const booking_model_1 = require("../booking/booking.model");
const car_model_1 = require("./car.model");
const car_utils_1 = require("./car.utils");
const createCarIntoDB = (car) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.create(car);
    return result;
});
const getAllCarsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const cars = yield car_model_1.Car.find({
        isDeleted: false,
    });
    return cars;
});
const getSingleCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield car_model_1.Car.isCarExistById(id)) === false) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    if ((yield car_model_1.Car.isCarDeleted(id)) === true) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    const car = yield car_model_1.Car.findById(id);
    return car;
});
const updateCarInDB = (id, car) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield car_model_1.Car.isCarExistById(id))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    if (yield car_model_1.Car.isCarDeleted(id)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    const { features } = car, remainingData = __rest(car, ["features"]);
    if (features) {
        // Build the $set update query for each feature index
        features.forEach((feature, index) => {
            remainingData[`features.${index}`] = feature;
        });
    }
    // Update the car with the merged data
    const updatedCar = yield car_model_1.Car.findByIdAndUpdate(id, { $set: remainingData }, { new: true });
    return updatedCar;
});
const deleteCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield car_model_1.Car.isCarExistById(id))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    if (yield car_model_1.Car.isCarDeleted(id)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    if (yield car_model_1.Car.isCarAvailable(id)) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Car is currently available, can not delete');
    }
    const deletedCar = yield car_model_1.Car.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return deletedCar;
});
const returnCarFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield car_model_1.Car.startSession();
    try {
        session.startTransaction();
        const { bookingId, endTime } = payload;
        // Check if booking exists
        const booking = yield booking_model_1.Booking.findById(bookingId);
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
        }
        // Check if booking is already returned
        if (booking.endTime) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Car already returned');
        }
        // Get the car details
        const carDetails = yield car_model_1.Car.findById(booking.car);
        if (!carDetails) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
        }
        // Calculate total cost
        const totalCost = (0, car_utils_1.calculateTotalCost)(booking.startTime, endTime, carDetails.pricePerHour);
        // Update car status
        const updatedCar = yield car_model_1.Car.findByIdAndUpdate(booking.car, { status: 'available' }, { session, runValidators: true, new: true });
        if (!updatedCar) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
        }
        // Update booking details
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(bookingId, { endTime, totalCost }, { session, runValidators: true, new: true });
        if (!updatedBooking) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
        }
        yield session.commitTransaction();
        yield session.endSession();
        // Get the updated booking details with populated user and car details
        const result = yield booking_model_1.Booking.findById(bookingId)
            .populate('user')
            .populate('car');
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.carService = {
    createCarIntoDB,
    getAllCarsFromDB,
    getSingleCarFromDB,
    updateCarInDB,
    deleteCarFromDB,
    returnCarFromDB,
};
