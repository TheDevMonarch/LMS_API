import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name:{type:String, required:true},
  URN:{type:String, required:true}
})

export const Student = mongoose.model("student", studentSchema)