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
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First Name is required'],
        maxlength: [20, 'First Name must not exceed 20 characters'],
        validate: {
            validator: function (value) {
                const nameRegex = /^[a-zA-Z]+$/;
                const str = value.charAt(0).toUpperCase() + value.slice(1);
                return str === value && nameRegex.test(value);
            },
            message: '{VALUE} is not valid format',
        },
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last Name is required'],
        maxlength: [20, 'Last Name must not exceed 20 characters'],
    },
});
const guardianSchema = new mongoose_1.Schema({
    fatherName: {
        type: String,
        trim: true,
        required: [true, 'Father Name is required'],
        maxlength: [20, 'Father Name must not exceed 20 characters'],
    },
    motherName: {
        type: String,
        trim: true,
        required: [true, 'Mother Name is required'],
        maxlength: [20, 'Mother Name must not exceed 20 characters'],
    },
});
const studentSchema = new mongoose_1.Schema({
    id: { type: String, unique: true, required: [true, 'ID is required'] },
    name: {
        type: userSchema,
        required: [true, 'Name is required'],
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female'],
            message: 'Gender must be either male or female',
        },
        required: [true, 'Gender is required'],
    },
    dateOfBirth: {
        type: String,
        required: [true, 'Date of Birth is required'],
    },
    address: { type: String, required: [true, 'Address is required'] },
    phone: { type: String, required: [true, 'Phone number is required'] },
    guardian: {
        type: guardianSchema,
        required: [true, 'Guardian information is required'],
    },
    profileImage: { type: String },
    isActive: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active',
        required: [true, 'Status is required'],
    },
    isDeleted: { type: Boolean, default: false },
}, {
    toJSON: { virtuals: true },
});
// virtuals
studentSchema.virtual('fullName').get(function () {
    return `${this.name.firstName} ${this.name.lastName}`;
});
studentSchema.pre('find', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.find({ isDeleted: { $ne: true } });
        next();
    });
});
studentSchema.pre('findOne', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.find({ isDeleted: { $ne: true } });
        next();
    });
});
studentSchema.pre('aggregate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
        next();
    });
});
// instance method
/*
studentSchema.methods.isUserExist = async function (id: string) {
  return this.model('Student').findOne
    ? this.model('Student').findOne({ id })
    : null;
};
*/
// static method
studentSchema.statics.isUserExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findOne ? this.findOne({ id }) : null;
    });
};
exports.Student = (0, mongoose_1.model)('Student', studentSchema);
