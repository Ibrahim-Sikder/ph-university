/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StudentServices } from './student.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';


const getAllStudent = catchAsync(async (req, res, next) => {

    const result = await StudentServices.getAllStudentFromDB(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student are retrieve successfully!',
      data: result,
    });
 
});
const getSingleStudent = catchAsync(async (req, res, next) => {

    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Student is retrieve successfully!',
      data: result,
    });

});
const deleteStudent = catchAsync(async (req, res, next) => {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentIntoDB(studentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is deleted successfully!',
      data: result,
    });

});
const updateStudent: RequestHandler = catchAsync(async (req, res, next) => {

  const { studentId } = req.params;
  const {student} = req.body
  const result = await StudentServices.updateStudentIntoDB(studentId, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' student update successfully!',
    data: result,
  });
  next()

});

export const StudentController = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
  updateStudent
};
