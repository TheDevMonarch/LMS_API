import express from 'express'
import { allotBooks, booksCompleted, getAllottedBooksById, getAllottedBooksInfo, getPenaltyBooksByid, changePenalty, returnBook } from "../Controllers/allottedBooks.js";
import { isAdmin, isAuthorized } from '../Middlewares/Auth.js';

const router = express.Router()

//@api - /api/allottedBooks/allotBooks
router.post('/allotBooks', isAuthorized, isAdmin, allotBooks)

//@api - /api/allottedBooks/returnBook
router.post('/returnBook', isAuthorized, isAdmin, returnBook)

//@api - /api/allottedBooks/getAllottedBooksData
router.get('/getAllottedBooksData', isAuthorized, isAdmin, getAllottedBooksInfo)

//@api - /api/allottedBooks/getAllottedBooksById
router.get('/getAllottedBooksById', isAuthorized ,getAllottedBooksById)

//@api - api/allottedBooks/getPenaltyBooksById
router.get('/getPenaltyBooksById', isAuthorized , getPenaltyBooksByid)

// @api - api/allottedBooks/penaltyPerDay
router.post('/penaltyPerDay', isAuthorized, isAdmin, changePenalty)

//@api - api/allottedBooks/booksCompleted
router.get('/booksCompleted', isAuthorized, booksCompleted)

export default router;