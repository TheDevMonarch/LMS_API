import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';

import userRouter from './Routes/user.js';
import bookRouter from './Routes/books.js';
import allottedBooksRouter from './Routes/allottedBooks.js';
import extensionRequestRouter from './Routes/extensionRequests.js';
import paymentRouter from './Routes/payment.js';
import addStudentRouter from './Routes/addStudent.js';
import { verifyToken } from './Utils/feature.js';

import './scheduler/dueReminderJob.js';

const app = express();


const envFile = process.env.NODE_ENV === 'production' ? './Data/config.prod.env' : './Data/config.dev.env';
dotenv.config({ path: envFile });


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use('/api/user', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/allottedBooks', allottedBooksRouter);
app.use('/api/extensionRequests', extensionRequestRouter);
app.use('/api/payment', paymentRouter);
app.use('/students', addStudentRouter);
app.use('/api/verifyToken', verifyToken);


mongoose.connect(process.env.MONGODB_URI, {
  dbName: "LibraryManagementSystem"
})
.then(() => console.log("MongoDB connected successfully..."))
.catch((error) => console.log(error));


const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`));
