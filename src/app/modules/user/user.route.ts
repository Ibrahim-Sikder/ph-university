import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { validateRequest } from '../../middlewares/validateReuest';
import { studentValidations } from '../student/student.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { userValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);
router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(userValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);
router.get('/me', auth('student', 'faculty', 'admin'), UserControllers.getMe);

export const UserRoutes = router;
