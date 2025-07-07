import { Books } from "../Models/Books.js";

//Add Books
export const addNewBooks = async (req, res) => {
  const { title, authorName, publication, isbn, category, location, totalCopies } =
    req.body;

  if (
    title === "" ||
    authorName === "" ||
    publication === "" ||
    category === "" ||
    location === "" ||
    totalCopies === ""
  ) {
    return res.json({ message: "All fields are required", success: false });
  }

  try {
    const book = await Books.findOne({ title, authorName, publication });

    if (!book) {
      await Books.create({
        title,
        authorName,
        publication,
        isbn,
        category,
        location,
        totalCopies,
        availableCopies:totalCopies
      });
      return res.json({ message: "Book added successfully" });
    } else {
      return res.json({ message: "Book already exist" });
    }
  } catch (error) {
    console.log(error);
  }
};

//get All Books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Books.find();
    if (!books) {
      return res.json({ message: "No Books to show", success: false });
    }

    res.json({ message: "Books fetched successfully", books, success: true });
  } catch (error) {
    console.log(error);
  }
};

//get books by search
export const getBooksBySearch = async (req, res) => {
  const { title = '', authorName = '', category = '' } = req.body;


  try {
    //$regex find the title in database that contain given title

// function to remove all extra spaces from the user input 
function makeFlexibleSpaceRegex(str) {
  return str.trim().split(/\s+/).join('\\s+');
}

let query = {};

if (title) {
  query.title = { $regex: makeFlexibleSpaceRegex(title), $options: "i" };

}

if (authorName) {
  query.authorName = { $regex: makeFlexibleSpaceRegex(authorName), $options: "i" };
}

if (category) {
  query.category = { $regex: makeFlexibleSpaceRegex(category), $options: "i" };
}

const books = await Books.find(query);


    if (!books) {
      return res.json({ message: "Books not found", success: false });
    }

    return res.json({
      message: "Books Found successfully",
      books,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Something went wrong!", success: false });
  }
};
 