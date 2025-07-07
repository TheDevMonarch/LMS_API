import { AllottedBooks } from "../Models/AllottedBooks.js";
import { Books } from "../Models/Books.js";
import { User } from "../Models/User.js";

export const allotBooks = async (req, res) => {
  const { URN, bookId } = req.body;

  try {
    let user = await User.findOne({ URN });

    //checking if user exist or not
    if (!user) {
      return res.json({ message: "User not found, register first!!" });
    }

    // students borrowed book
    let student = await AllottedBooks.findOne({ URN });

    let book = await Books.findById(bookId);

    //check if book is available or not
    if (book.availableCopies === 0) {
      return res.json({
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

      return res.json({
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
      return res.json({ message: "This book already allotted to this user" });
    }

    student.books.push({ bookId: bookId });

    await student.save();

    book.availableCopies -= 1;
    await book.save();

    return res.json({
      message: "Book Allotted Successfully",
      student,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong!!", success: false });
  }
};

export const returnBook = async (req, res) => {
  const { URN, bookId } = req.body;

  try {
    let user = await User.findOne({ URN });

    let book = await Books.findById(bookId);

    let student = await AllottedBooks.findOne({ URN });

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

  // Add 2 days to borrowed date
  const minValidDate = new Date(borrowedDate);
  minValidDate.setDate(minValidDate.getDate() + 2);

  // Check: today >= borrowedDate + 2  AND today < dueDate
  return today >= minValidDate && today < dueDate;
}
  

    if (bookIndex > -1) {
      student.books.splice(bookIndex, 1);
      book.availableCopies += 1;
      user.returnedBooks.push(bookId);

      if(isWithinValidWindow(Book.borrowDate, Book.returnDate)){
        user.honourScore += 1;
      }

      await student.save();
      await book.save();
      await user.save();

      return res.json({ message: "Book returned successfully", success: true });
    } else {
      return res.json({ message: "Book record not found", success: false });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: "Something went wrong", success: false });
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

    // First fetched the id of each borrowed book and then according to each book id fetched the book details.
    // Now this book details merged with allotted book data response

    if(!booksInfo[0].books){
      res.json({message:"Books not allotted yet."})
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

    res.json({
      message: "Details fetched successfully",
      bookDetailsResponse,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went Wrong!!" });
  }
};


