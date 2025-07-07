import express from 'express'
import { getUserData, login, logOut, register } from '../Controllers/user.js';
import { isAuthorized } from '../Middlewares/Auth.js';

const router = express.Router()

//@api - /api/user/register
router.post('/register', register)

//@api - /api/user/login
router.post('/login', login)

//@api - /api/user/logout
router.get('/logout', logOut)

//@api - /api/user/getUserData
router.get('/getUserData', isAuthorized, getUserData)

export default router;