import { Books } from "../Models/Books.js";
import { User } from "../Models/User.js";
import cloudinary from '../Utils/cloudinary.js';
import streamifier from 'streamifier';

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
    return res.status(400).json({ message: "All fields are required", success: false });
  }

  try {
    const book = await Books.findOne({ title, authorName, publication });

    // Upload image to Cloudinary
    let coverImageUrl = "";
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "book_covers" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      coverImageUrl = result.secure_url;
    }

    if (!book) {
      await Books.create({
        title,
        authorName,
        publication,
        isbn,
        category,
        location,
        totalCopies,
        availableCopies:totalCopies,
        coverImage: coverImageUrl
      });

      
      return res.status(201).json({ message: "Book added successfully", success:true });
    } else {
      return res.status(409).json({ message: "Book already exist", success:false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
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


    if (!books || books.length === 0) {
      return res.status(404).json({ message: "Books not found", success: false });
    }

    return res.json({
      message: "Books Found successfully",
      books,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ message: "Something went wrong!", success: false });
  }
};