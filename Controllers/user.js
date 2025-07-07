import { User } from "../Models/User.js";
import { Student } from "../Models/Students.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { generateCookie } from "../Utils/feature.js";

// user register
export const register = async (req, res) => {
  const { URN, email, password } = req.body;

  try {
    let student = await Student.findOne({ URN });
    if (!student) {
      return res.status(400).json({
        message: "You can not register. Contact admin",
        success: false,
      });
    }

    let user = await User.findOne({ URN });
    if (user) {
      return res.status(409).json({
        message: "You are already registered in Library",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name: student.name,
      email,
      URN,
      password: hashPassword,
    });

    generateCookie(user,res,200,`user created successfully`)
    


  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

// user login
export const login = async (req, res) => {
  const { URN, password } = req.body;

  try {
    let user = await User.findOne({ URN });

    if (!user) {
      return res.status(404).json({ message: "User Not Found", success: false });
    }

    const hashPassword = user.password;


    const validPassword = await bcrypt.compare(password, hashPassword);

    if (!validPassword) { 
      return res.status(401).json({ message: "Invalid Password", success: false });
    }

    generateCookie(user,res,201,`Welcome ${user.name}`)

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};


export const logOut = (req, res)=>{
  res.status(200).cookie("LMS_Token", "", {
    expires:new Date(Date.now())
  } ).json({
    success:true,
    message:'Logout successfully!'
  })
}

export const getUserData = async(req,res) =>{
  const id = req.user

  try {
    let LMSuser = await User.findById(id);
    if(!LMSuser){
     return res.status(404).json({message:"User Not found", success:false});
    }

    return res.status(201).json({message:"User detail fetched Successfully", LMSuser, success:true})


  } catch (error) {
    
  }

}