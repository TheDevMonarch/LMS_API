import express from 'express'
import { getStudentInfoByURN, getUserData, login, logOut, register } from '../Controllers/user.js';
import { isAdmin, isAuthorized } from '../Middlewares/Auth.js';

const router = express.Router()

//@api - /api/user/register
router.post('/register', register)

//@api - /api/user/login
router.post('/login', login)

//@api - /api/user/logout
router.get('/logout', logOut)

//@api - /api/user/getUserData
router.get('/getUserData', isAuthorized, getUserData)

//@api -/api/user/getStudentInfoByURN
router.post('/getStudentInfoByURN', isAuthorized, isAdmin, getStudentInfoByURN)

export default router;