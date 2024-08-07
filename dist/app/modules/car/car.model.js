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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const mongoose_1 = require("mongoose");
const carSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    isElectric: {
        type: Boolean,
        required: true,
    },
    pricePerHour: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available',
    },
    features: {
        type: [String],
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
carSchema.statics.isCarExistById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const car = yield this.findById(id);
        return !!car; // !!car === car ? true : false
    });
};
carSchema.statics.isCarAvailable = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const car = yield this.findById(id);
        return (car === null || car === void 0 ? void 0 : car.status) === 'available';
    });
};
carSchema.statics.isCarDeleted = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const car = yield this.findById(id);
        return car === null || car === void 0 ? void 0 : car.isDeleted;
    });
};
exports.Car = (0, mongoose_1.model)('Car', carSchema);
