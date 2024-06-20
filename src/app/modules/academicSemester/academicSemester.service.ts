/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterFromDB = async (payload: TAcademicSemester) => {

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester code ');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemesterFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};
const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};
const deleteAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.deleteOne({ id });
  return result;
};
const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  return {};
};

export const AcademicSemesterServices = {
  createAcademicSemesterFromDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
  deleteAcademicSemesterFromDB,
};
