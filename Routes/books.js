import express from 'express'
import { addNewBooks, getAllBooks, getBooksBySearch } from '../Controllers/books.js';
import { isAdmin, isAuthorized } from '../Middlewares/Auth.js';
import upload from '../Middlewares/multer.js';
import rateLimit from 'express-rate-limit';

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: "Too many requests. Please try again after a minute."
});


const router = express.Router()

//@api - api/books/addNewBook
router.post('/addNewBook', isAuthorized, isAdmin, upload.single('coverPhoto'), addNewBooks)

//@api - api/books/getBooks
router.get('/getBooks', getAllBooks)

//@api - api/books/search
router.post('/search', searchLimiter, getBooksBySearch)



export default router;