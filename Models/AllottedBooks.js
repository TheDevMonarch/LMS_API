import mongoose from "mongoose";

const formatDate = (date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

// This returns today's date in DD-MM-YYYY
const getTodayFormatted = () => formatDate(new Date());

// This returns today's date + 14 days in DD-MM-YYYY
const getReturnDateFormatted = () => {
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 14);
  return formatDate(returnDate);
};

const BooksSchema = new mongoose.Schema({
  bookId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Books",
    required:true
  },
   borrowDate: {
    type: String,
    default: getTodayFormatted
  },
  returnDate: {
    type: String,
    default: getReturnDateFormatted
  }
})

const allottedBookSchema = new mongoose.Schema({
  URN:{
    type:String,
    ref:"Students",
    required:true
  },
  books:[BooksSchema]
})

export const AllottedBooks = mongoose.model("allotedbook", allottedBookSchema)
