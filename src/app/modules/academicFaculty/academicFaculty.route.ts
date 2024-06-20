import express from 'express';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { validateRequest } from '../../middlewares/validateReuest';
const router = express.Router();

router.post('/create-academic-faculty', validateRequest(AcademicFacultyValidation.createAcademicFacultyValidationSchema), AcademicFacultyControllers.createAcademicFaculty);
router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);
router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);
router.patch('/:facultyId', validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidationSchema), AcademicFacultyControllers.updateAcademicFaculty);
export const AcademicFacultyRoutes = router;
