import mongoose from "mongoose";

const BookIdSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books",
    required: true
  },
  bookTitle:{type:String, required:true},
  borrowDate:{type:String, required:true},
  returnDate:{type:String, required:true},
  createdAt: {type: Date, default: Date.now },
  NoOfDays: { type: Number, required: true },
  status:{type:String, default:"Pending"}
})

const ExtensionRequestSchema = new mongoose.Schema({
  URN: {
    type: String,
    ref: "Students",
    required: true
  },
  student_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Students",
    required: true
  },
  bookRequests: [BookIdSchema]
})

export const ExtensionRequests = mongoose.model('ExtensionRequests', ExtensionRequestSchema)