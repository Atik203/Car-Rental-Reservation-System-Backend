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
exports.User = exports.userSchema = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        select: 0,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        user.password = yield bcrypt_1.default.hashSync(user.password, Number(config_1.default.bcrypt_salt));
        next();
    });
});
exports.userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
exports.userSchema.statics.isUserExistByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        return user ? true : false;
    });
};
exports.userSchema.statics.isUserPasswordMatched = function (email, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email }).select('+password');
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        const isPasswordMatched = bcrypt_1.default.compareSync(userPassword, user.password);
        if (!isPasswordMatched) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect password');
        }
        const userObj = user.toObject();
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const { password } = userObj, userWithoutPassword = __rest(userObj, ["password"]);
        return userWithoutPassword;
    });
};
exports.User = (0, mongoose_1.model)('User', exports.userSchema);
