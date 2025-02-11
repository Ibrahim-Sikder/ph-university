import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AppError } from '../../error/AppError';



const academicDepartmentSchema = new Schema<TAcademicDepartment>({
  name: {
    type: String,
    unique: true,
    required:true,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
  },
},{
    timestamps: true
});


// academicDepartmentSchema.pre('save', async function(next){
//   const isDepartmentExist = await  AcademicDepartment.findOne({
//     name: this.name
//   })

//   if(isDepartmentExist){
//     throw new AppError(httpStatus.NOT_FOUND,'Department is already exist!')
//   }

//   next()
// })

academicDepartmentSchema.pre('findOneAndUpdate', async function(next){
  const query = this.getQuery();

  const isDepartmentExist = await  AcademicDepartment.findOne(query)

  if(!isDepartmentExist){
    throw new AppError(404, 'This department does not exist there !')
  }
  next()


})



export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
