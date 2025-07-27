import express from 'express'
import { acceptRequest, getAllExtensionRequestsData, getExtensionRequestData, NewRequest, rejectRequest } from '../Controllers/extensionRequests.js';
import { isAdmin, isAuthorized } from '../Middlewares/Auth.js';

const router = express.Router();

// @api - api/extensionRequests/addNewRequest
router.post('/addNewRequest',isAuthorized, NewRequest)

// @api - api/extensionRequests/getRequestsData
router.get('/getRequestsData', isAuthorized, getExtensionRequestData)

//@api - api/extensionRequests/getAllRequestsData
router.get('/getAllRequestsData', isAuthorized, isAdmin, getAllExtensionRequestsData)

//@api - api/extensionRequests/acceptRequest
router.post('/acceptRequest', isAuthorized, isAdmin, acceptRequest)

// @api - api/extensionRequests/rejectRequest
router.post('/rejectRequest', isAuthorized, isAdmin, rejectRequest)


export default router;

