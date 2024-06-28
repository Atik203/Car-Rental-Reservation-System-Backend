import express from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { carRoutes } from '../modules/car/car.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/cars',
    route: carRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
