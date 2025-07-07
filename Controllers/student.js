import { Student } from "../Models/Students.js";

export const addStudent = async(req, res)=>{

  const { name, URN } = req.body

  const student = await Student.findOne({URN})

  if(student){
   
    return res.json({message:"Student detail already exist", success:false})

  }

  await Student.create({name, URN})

   return res.json({message:"Student detail added successfully", success:true})



}