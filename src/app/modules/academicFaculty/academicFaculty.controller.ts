import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";
import { catchAsync } from "../../utils/catchAsync";

const createAcademicFaculty = catchAsync(async(req, res)=>{

    const result = await AcademicFacultyServices.createAcademicFacultyInto(req.body);
 
    sendResponse(res, {
     statusCode: httpStatus.OK,
     success: true,
     message: 'Academic Faculty is created successfully',
     data:result
   })
 })
 const getAllAcademicFaculty = catchAsync(async(req, res)=>{
 
    const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB();
 
    sendResponse(res, {
     statusCode: httpStatus.OK,
     success: true,
     message: 'Academic Faculty are retrieved successfully',
     data:result
   })
 })
 const getSingleAcademicFaculty = catchAsync(async(req, res)=>{
   const {facultyId} = req.params
 
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId);
 
    sendResponse(res, {
     statusCode: httpStatus.OK,
     success: true,
     message: 'Single Academic Faculty is retrieved successfully',
     data:result
   })
 })
 const deleteAcademicFaculty = catchAsync(async(req, res)=>{
   const {facultyId} = req.params
 
    const result = await AcademicFacultyServices.deleteAcademicFacultyFromDB(facultyId);
 
    sendResponse(res, {
     statusCode: httpStatus.OK,
     success: true,
     message: 'Academic Faculty delete successfully',
     data:result
   })
 })
 const updateAcademicFaculty = catchAsync(async(req, res)=>{
   const {facultyId} = req.params
 
    const result = await AcademicFacultyServices.updateAcademicFacultyInto(facultyId,req.body);
 
    sendResponse(res, {
     statusCode: httpStatus.OK,
     success: true,
     message: 'Academic Faculty update successfully',
     data:result
   })
 })
 
 
 export const AcademicFacultyControllers = {
      createAcademicFaculty,
      getAllAcademicFaculty,
      getSingleAcademicFaculty,
      updateAcademicFaculty,
      deleteAcademicFaculty

 }
 