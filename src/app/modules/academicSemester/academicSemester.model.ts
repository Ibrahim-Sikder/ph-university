/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose';

import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: AcademicSemesterName,
    },
    year: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      enum: AcademicSemesterCode,
    },
    startMonth: {
      type: String,
      required: true,
      enum: Months,
    },
    endMonth: {
      type: String,
      required: true,
      enum: Months,
    },
  },
  {
    timestamps: true,
  },
);

academicSemesterSchema.pre('save', async function (next) {
  try {
    const isSemesterExists = await AcademicSemester.findOne({
      year: this.year,
      name: this.name,
    });
    if (isSemesterExists) {
      return next(new Error('Semester already exists!'));
    }
    next();
  } catch (err:any) {
    next(err);
  }
});


export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
