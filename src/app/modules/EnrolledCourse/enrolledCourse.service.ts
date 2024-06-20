import httpStatus from "http-status";
import { AppError } from "../../error/AppError";
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import EnrolledCourse from "./enrolledCourse.model";
import { Student } from "../student/student.model";

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1: Check if the offered cousres is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */

  const {offeredCourse} = payload
  const isOfferCourseExists = await OfferedCourse.findById(offeredCourse)
  if(!isOfferCourseExists){
    throw new AppError(httpStatus.NOT_FOUND,'Offered course not found ')
  }

  const student = await Student.findOne({id:userId})
  if(!student){
    throw new AppError(httpStatus.NOT_FOUND,'Student not found ')
  }


  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferCourseExists?.semesterRegistration,
    offeredCourse,
    student: student?.id
  })
  if(isStudentAlreadyEnrolled){
    throw new AppError(httpStatus.CONFLICT,'Student is already enrolled ')
  }
  if(isOfferCourseExists.maxCapacity <= 0){
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full')
  }

  
};

const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  
};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
 

};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  getMyEnrolledCoursesFromDB,
  updateEnrolledCourseMarksIntoDB,
};
