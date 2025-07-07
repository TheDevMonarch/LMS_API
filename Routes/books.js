import express from 'express'
import { addNewBooks, getAllBooks, getBooksBySearch } from '../Controllers/books.js';

const router = express.Router()

//@api - api/books/new
router.post('/new', addNewBooks)

//@api - api/books/getBooks
router.get('/getBooks', getAllBooks)

//@api - api/books/search
router.post('/search', getBooksBySearch)


export default router;