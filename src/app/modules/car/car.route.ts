import express from 'express';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { carController } from './car.controller';
import {
  CarValidationSchema,
  returnCarValidationSchema,
} from './car.zod.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CarValidationSchema),
  carController.createCar,
);
router.get('/', carController.getAllCars);
router.get('/:id', carController.getSingleCar);

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CarValidationSchema),
  carController.updateCar,
);

router.delete('/:id', auth(USER_ROLE.admin), carController.deleteCar);

router.put(
  '/return',
  auth(USER_ROLE.admin),
  validateRequest(returnCarValidationSchema),
  carController.returnCar,
);

export const carRoutes = router;
