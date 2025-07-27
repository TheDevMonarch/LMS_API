import { User } from "../Models/User.js";
import { Student } from "../Models/Students.js";
import bcrypt from "bcryptjs";
import validator from "validator";


import { generateCookie } from "../Utils/feature.js";

// user register
export const register = async (req, res) => {
  const { URN, email, password} = req.body;
  const role = "student";

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
    const sanitizedEmail = validator.normalizeEmail(email.trim());


    user = await User.create({
      name: student.name,
      email: sanitizedEmail,
      URN,
      role,
      password: hashPassword,
    });

    generateCookie(user,res,200, `user created successfully`)
    


  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

// user login
export const login = async (req, res) => {
  const { identifier, password, role } = req.body;

  try {
    let user = await User.findOne({
      $or: [{ URN: identifier }, { username: identifier }],
      role
    });

    if (!user) {
      return res.status(404).json({ message: "User Not Found", success: false });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Password", success: false });
    }

    generateCookie(user, res, 201, `Welcome ${user.name}`);

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

// user logout
export const logOut = (req, res)=>{
  res.status(200).cookie("LMS_Token", "", {
    expires:new Date(Date.now())
  } ).json({
    success:true,
    message:'Logout successfully!'
  })
}

// get user data
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

// get student info by URN
export const getStudentInfoByURN = async(req,res)=>{

  const {URN} = req.body;

  try {

    let studentInfo = await User.findOne({URN}).select("name URN email").lean();
    if(!studentInfo){
      return res.status(404).json({message:"Record Not found", success:false})
    }

    return res.status(200).json({message:"Data fetched successfully", studentInfo, success:true})
    
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error", success:false})
  }
}