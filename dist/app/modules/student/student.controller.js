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
exports.studentController = void 0;
// import studentValidationSchema from './student.joi.validation';
const zod_1 = require("zod");
const student_service_1 = require("./student.service");
const student_zod_validation_1 = __importDefault(require("./student.zod.validation"));
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = req.body.student;
        const zodParseData = student_zod_validation_1.default.parse(student);
        // const { error, value } = studentValidationSchema.validate(student);
        // if (error) {
        //   res.status(500).json({
        //     success: false,
        //     message: error.details[0].message,
        //   });
        // }
        const result = yield student_service_1.studentService.createStudentIntoDB(zodParseData);
        res.status(200).json({
            success: true,
            message: 'Student created successfully',
            data: result,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues.map((issue) => {
                const message = issue.message;
                return `${message}`;
            });
            res.status(400).json({
                success: false,
                message: messages,
            });
        }
        else if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: [error.message],
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: ['An unknown error occurred'],
            });
        }
    }
});
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield student_service_1.studentService.getAllStudentsFromDB();
        res.status(200).json({
            success: true,
            message: 'Students fetched successfully',
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'An unknown error occurred',
            });
        }
    }
});
const getSingleStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.studentId;
        const result = yield student_service_1.studentService.getSingleStudentFromDB(id);
        res.status(200).json({
            success: true,
            message: 'Student fetched successfully',
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'An unknown error occurred',
            });
        }
    }
});
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.studentId;
        const result = yield student_service_1.studentService.deleteStudentFromDB(id);
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'An unknown error occurred',
            });
        }
    }
});
exports.studentController = {
    createStudent,
    getAllStudents,
    getSingleStudent,
    deleteStudent,
};
