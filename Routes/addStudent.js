import express from 'express';
import { addStudent } from '../Controllers/student.js';
import { isAdmin, isAuthorized } from '../Middlewares/Auth.js';
const router = express.Router();

// @api - /students/
router.post('/', isAuthorized, isAdmin, addStudent);

export default router;