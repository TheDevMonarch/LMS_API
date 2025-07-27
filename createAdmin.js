import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({path:'./Data/config.env'});

import { User } from "./Models/User.js";

await mongoose.connect(process.env.MONGODB_URI, {
  dbName:"LibraryManagementSystem"
}).then(() => { console.log("MongoDB connected successfully...") }).catch((error) => { console.log(error) });


const hashedPassword = await bcrypt.hash("2305", 10);

await User.create({
  name: "Super Admin",
  email: "admin@campusreads.com",
  username:"AdminAR14",
  password: hashedPassword,
  role: "admin",
});

console.log("✅ Admin user created successfully!");

process.exit(); // Exit script
