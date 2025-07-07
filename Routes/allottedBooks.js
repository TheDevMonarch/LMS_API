import express from 'express'
import { allotBooks, getAllottedBooksById, getAllottedBooksInfo, returnBook } from "../Controllers/allottedBooks.js";
import { isAuthorized } from '../Middlewares/Auth.js';

const router = express.Router()

//@api - /api/allottedBooks/allotBooks
router.post('/allotBooks', allotBooks)

//@api - /api/allottedBooks/returnBook
router.post('/returnBook', returnBook)

//@api - /api/allottedBooks/getAllottedBooksData
router.get('/getAllottedBooksData', getAllottedBooksInfo)

//@api - /api/allottedBooks/getAllottedBooksById
router.get('/getAllottedBooksById', isAuthorized ,getAllottedBooksById)

export default router;
