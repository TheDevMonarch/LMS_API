import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './Routes/user.js'
import bookRouter from './Routes/books.js'
import allottedBooksRouter from './Routes/allottedBooks.js'
import { addStudent } from './Controllers/student.js';
import bodyParser from 'body-parser';


const app = express()

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
dotenv.config({ path: './Data/config.env' });

//Cors for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

//User Router
app.use('/api/user', userRouter)

//Book Router
app.use('/api/books', bookRouter)

//allotted Book Router
app.use('/api/allottedBooks', allottedBooksRouter)

//add new student
app.use('/students', addStudent)



mongoose.connect(process.env.MONGODB_URI, {
  dbName: "LibraryManagementSystem"
}).then(() => { console.log("MongoDB connected successfully...") }).catch((error) => { console.log(error) })


const port = process.env.PORT;

app.listen(port, () => { console.log(`Server is running on port ${port}`) })