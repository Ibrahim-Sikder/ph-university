import express from 'express'
import { StudentController } from './student.controller';
import { validateRequest } from '../../middlewares/validateReuest';
import { studentValidations } from './student.validation';


const router = express.Router()



router.get('/',StudentController.getAllStudent)
router.get('/:studentId',StudentController.getSingleStudent)
router.delete('/:studentId',StudentController.deleteStudent)
router.patch('/:studentId',validateRequest(studentValidations.updateStudentValidationSchema), StudentController.updateStudent)



export const StudentRoutes = router ;