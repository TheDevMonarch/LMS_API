import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{type:String, required:true},
  email:{type:String, required:true},
  URN:{type:String, required:true},
  password:{type:String, required:true},
  returnedBooks:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Books"
    }
],
honourScore:{type:Number, default:0}
})


export const User = mongoose.model("user", userSchema)