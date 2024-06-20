import httpStatus from 'http-status';

import { UserServices } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../error/AppError';

const createStudent = catchAsync(async (req, res) => {

  const { password, student } = req.body;

  const result = await UserServices.createStudentIntoDB(req.file,password, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(
    req.file,
    password,
    facultyData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created succesfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(
    req.file,
    password,
    adminData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});
const getMe = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'Token not found');
  }

  const result = await UserServices.getMe(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieve successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is update successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createAdmin,
  createFaculty,
  getMe,
  changeStatus,
};
