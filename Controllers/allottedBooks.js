import { AllottedBooks } from "../Models/AllottedBooks.js";
import { Books } from "../Models/Books.js";
import { User } from "../Models/User.js";

export const allotBooks = async (req, res) => {
  const { URN, bookId } = req.body;

  try {

    let [user, student, book] = await Promise.all([User.findOne({ URN }), AllottedBooks.findOne({ URN }), Books.findById(bookId)]);


    //checking if user exist or not
    if (!user) {
      return res.status(404).json({ message: "User not found, register first!!" });
    }


    //check if book is available or not
    if (book.availableCopies === 0) {
      return res.status(404).json({
        message: "Book is not available right now",
        success: false,
      });
    }

    // If student is getting first book to read this will run
    if (!student) {
      student = await AllottedBooks.create({
        URN,
        books: [{ bookId: bookId }],
      });

      book.availableCopies -= 1;
      await book.save();

      return res.status(201).json({
        message: "First book allotted successfully",
        student,
        success: true,
      });
    }

    //checking if the user already have the requested book or not
    let isBookAllotted = student.books.find((book) => {
      return book.bookId.toString() === bookId;
    });

    if (isBookAllotted) {
      return res.status(409).json({ message: "Selected book already allotted to this user" });
    }

    student.books.push({ bookId: bookId });
    book.availableCopies -= 1;

    await Promise.all([student.save(), book.save()])

    return res.status(201).json({
      message: "Book Allotted Successfully",
      student,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!", success: false });
  }
};

export const returnBook = async (req, res) => {
  const { URN, bookId } = req.body;

  try {

    let [user, book, student] = await Promise.all([User.findOne({ URN }), Books.findById(bookId), AllottedBooks.findOne({ URN })]);


    if (!student) {
      return res.json({ message: "Student record not found", success: false });
    }

    let bookIndex = student.books.findIndex((book) => {
      return book.bookId.toString() === bookId;
    });

    let Book = student.books[bookIndex]

  
  function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
}

function isWithinValidWindow(borrowedStr, dueStr) {
  const borrowedDate = parseDate(borrowedStr);
  const dueDate = parseDate(dueStr);

  // Today's date at 00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check:  today <= dueDate
  return today <= dueDate;
}
  

    if (bookIndex < 0 ) {
  
      return res.status(404).json({ message: "Book record not found", success: false });

    }else if(!isWithinValidWindow(Book.borrowDate, Book.returnDate)){  
      return res.status(403).json({message:"Penalty is pending...", success:false})
    } else {

      student.books.splice(bookIndex, 1);
      book.availableCopies += 1;
      user.returnedBooks.push(bookId);

      await student.save();
      await book.save();
      await user.save();
     return res.status(200).json({ message: "Book returned successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const getAllottedBooksInfo = async (req, res) => {
  try {

    const allottedBooksInfo = await AllottedBooks.find();

    const bookIds = allottedBooksInfo.flatMap((info) => {
      return info.books.map((book) => {
        return book.bookId;
      });
    });

    // const allottedBooksInfo = await AllottedBooks.find();

    // const bookIds = allottedBooksInfo
    //   .flatMap((info) =>
    //     (info.books).map((book) => book.bookId?.toString())
    //   );

    // console.log("Final bookIds:", bookIds);

    const bookDetails = await Books.find({ _id: { $in: bookIds } })
      .select("-location -totalCopies -availableCopies -__v")
      .lean();

    const bookMap = {};
    bookDetails.forEach((book) => {
      bookMap[book._id.toString()] = book;
    });

    const updatedData = allottedBooksInfo.map((student) => {
      const Data = student.books.map((book) => {
        const plainBook = book.toObject();
        return {
          ...plainBook,
          BookDetail: bookMap[book.bookId.toString()] || null,
        };
      });

      const plainStudentData = student.toObject();
      return {
        ...plainStudentData,
        books: Data,
      };
    });

    if (!allottedBooksInfo) {
      return res.json({ message: "Data Not found", success: false });
    }
    return res.json({
      message: "Data fetched successfully",
      updatedData,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong!!", success: false });
  }
};

export const getAllottedBooksById = async (req, res) => {
  let id = req.user;

  // console.log(id)

  try {
    let student = await User.findById(id);

    let URN = student.URN;

    let booksInfo = await AllottedBooks.find({ URN });

    if (!booksInfo || booksInfo.length === 0) {
      return res.status(204).json({ message: "No books allotted to this user", success: false });
    }

    // First fetched the id of each borrowed book and then according to each book id fetched the book details.
    // Now this book details merged with allotted book data response

    if(!booksInfo[0].books){
    return res.status(204).json({message:"Books not allotted yet."})
    }


    let bookIds = booksInfo[0].books.map((book) => {
      return book.bookId;
    });

    const bookDetails = await Books.find({ _id: { $in: bookIds } }).lean();

    const bookMap = {};
    bookDetails.forEach((book) => {
      bookMap[book._id.toString()] = book;
    });

    const bookDetailsResponse = booksInfo[0].books.map((book) => {
      const plainBook = book.toObject();
      return {
        ...plainBook,
        bookDetails: bookMap[book.bookId.toString()] || null,
      };
    });

    // console.log(userBooks)

    res.status(200).json({
      message: "Details fetched successfully",
      bookDetailsResponse,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went Wrong!!" });
  }
};

let penaltyperDay = 1;

export const getPenaltyBooksByid = async(req, res)=>{
  const id = req.user;

  try {
    const student = await User.findById(id).select('URN')

    const URN = student.URN
    
    const today = new Date()

    const allottedBooks = await AllottedBooks.findOne({URN})
    // console.log(allottedBooks.books)
    // console.log(student.URN)

    if(!allottedBooks){
      return res.status(204).json({message:"No books allotted to this user", success  :false})
    }

    const books = allottedBooks.books.filter((Book)=>{
      const [day, month, year] = Book.returnDate.split("-");
      const returnDate= new Date(`${year}-${month}-${day}`); 

      return today > returnDate})

    const bookIds = books.flatMap((Book)=>Book.bookId)

    const booksData = await Books.find({ _id: { $in: bookIds } })
      .select("title")
      .lean();

     const bookMap = {};
    booksData.forEach((book) => {
      bookMap[book._id.toString()] = book;
    });  
      
    const Data=books.map((book)=>{
      const plainBook = book.toObject();
      const [day, month, year] = book.returnDate.split("-");
      const returnDate= new Date(`${year}-${month}-${day}`);
      const milliSeconds = today - returnDate;
      const Days = Math.floor(milliSeconds / (1000 * 60 * 60 * 24));
     return{
      ...plainBook,
      daysOverDue: Days,
      bookData:bookMap[book.bookId.toString()]
    }
    }) 

    res.status(201).json({message:"Data Fetched Successfully", penaltyperDay, Data})
      // console.log(bookIds)

  } catch (error) {
    console.log(error)
  }

}

export const changePenalty = (req,res) =>{
  const {penalty} = req.body;
  penaltyperDay = penalty;
  // console.log(penaltyperDay)
  // console.log(new Date())

  res.status(201).json({message:`Penalty changed successfully to ${penaltyperDay}`, success:true})
}

export const booksCompleted = async(req,res)=>{
  const id = req.user;

  try {
    const studentUser = await User.findById(id);

    const returnedBooks = [...new Set(studentUser.returnedBooks)];

    // console.log(returnedBooks)

    const returnBooksData = await Books.find({ _id: {$in : returnedBooks} })

    // console.log(returnBooksData)

    res.status(200).json({message:"Details fetched successfully", returnBooksData, success:true})   

  } catch (error) {
    res.status(500).json({message:"Internal Server Error", success: false})
  }
}

