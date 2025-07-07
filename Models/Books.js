import mongoose from "mongoose";

const BooksSchema = new mongoose.Schema({
  title:{type:String, required:true},
  authorName:{type:String, required:true},
  publication:{type:String, required:true},
  isbn:{type:String},
  category:{type:String, required:true},
  location:{type:String, required:true},
  totalCopies:{type:Number, required:true},
  availableCopies:{type:Number, required:true}
})

export const Books = mongoose.model("books", BooksSchema)