"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
// import { userRoute } from '../modules/user/user.route';
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: 'some route', // have add route like this like userRoute
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
