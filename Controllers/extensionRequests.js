import { ExtensionRequests } from "../Models/ExtensionRequests.js";
import {Books} from '../Models/Books.js'
import { AllottedBooks } from "../Models/AllottedBooks.js";

export const NewRequest = async(req, res)=>{

  const student_id = req.user;

  const {URN, bookId, bookTitle, borrowDate, returnDate, NoOfDays} = req.body;
   try {
    
    let Requests = await ExtensionRequests.findOne({student_id})

    if(!Requests){
      Requests = await ExtensionRequests.create({
        URN,
        student_id,
        bookRequests:[{bookId, bookTitle, borrowDate, returnDate, NoOfDays}]
      })

      return res.status(201).json({message:"Request sent successfully", Requests, success:true})
    } 

    const isBookRequestExist = Requests.bookRequests.find((book)=>{
    return (book.bookId.toString() === bookId.toString())
    })

    // console.log(isBookRequestExist) 
    if(!isBookRequestExist){
      Requests.bookRequests.push({bookId, bookTitle, borrowDate, returnDate, NoOfDays})
      await Requests.save();

      return res.status(201).json({message:"New Book Extension Request Added successfully", success:true})
    }

    if(isBookRequestExist && (isBookRequestExist.status === "Pending" || isBookRequestExist.status === "rejected")){
    return res.status(409).json({message:`Request already submitted for this book. Status:${isBookRequestExist.status}`, success:false})
    }

    isBookRequestExist.NoOfDays = NoOfDays;
    isBookRequestExist.status = "Pending"

    await Requests.save();

    return res.status(201).json({message:"Request added successfully", success:true})
    
   } catch (error) {
      console.error(" Error in NewRequest:", error);
      return res.status(500).json({ message: "Internal Server Error", success: false });
   }
}

export const getExtensionRequestData = async(req, res)=>{
  const id = req.user;
  const role = req.role;

  if(role === 'admin'){
    return res.json({message:"You are logined as Admin", success:false})
  }

  try {
    
    const Requests = await ExtensionRequests.findOne({student_id : id}).select("bookRequests")
    // console.log(Requests)
    if(!Requests){
      return res.status(204).json({message:"No extension requests found", success:false})
    }

    const bookIds = Requests.bookRequests.flatMap((book)=>{return book.bookId})
    // console.log(bookIds)

    if(!bookIds.length){
      return res.status(204).json({message:"No extension requests found", success:false})
    }

    const BookData = await Books.find({ _id: { $in: bookIds }}).select("title authorName publication coverImage").lean()

    // console.log(BookData)
    let bookMap = {};
    BookData.forEach((book)=>{
    return  bookMap[book._id.toString()] = book
    })

    // console.log(bookMap)

    const ExtensionRequestData = Requests.bookRequests.flatMap((request)=>{
      const plainRequest = request.toObject();
      return {
          ...plainRequest,
          BookData: bookMap[request.bookId.toString()]
      }
    })

    // console.log(ExtensionRequestData)

    return res.status(201).json({message:"Data fetched successfully", ExtensionRequestData, success:true})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:error, success:false})
  }
}

export const getAllExtensionRequestsData =  async(req, res)=>{

  try {
    
    let Requests = await ExtensionRequests.find();
    return res.status(200).json({message:"Data fetched successfully", Requests})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Something Went Wrong", success:false})
  }
}


function addDaysToDate(dateStr, N) {
  // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD' for proper parsing
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);

  // Add N days
  date.setDate(date.getDate() + N);

  // Format back to 'DD-MM-YYYY'
  const newDay = String(date.getDate()).padStart(2, "0");
  const newMonth = String(date.getMonth() + 1).padStart(2, "0");
  const newYear = date.getFullYear();

  return `${newDay}-${newMonth}-${newYear}`;
}



export const acceptRequest = async(req,res)=>{
  const {student_id, bookId} = req.body;

  try {
    
    let requestData = await ExtensionRequests.findOne({student_id:student_id})
    // console.log(requestData)
    const getAllottedBookData = await AllottedBooks.findOne({URN:requestData.URN})

    const bookRequest =  requestData.bookRequests.find((Book)=>{
      return Book.bookId.toString()===bookId.toString()
    })
    
    let bookData = getAllottedBookData.books.find((Book)=>{
      return Book.bookId.toString()===bookId.toString()
    })

    console.log(bookData.returnDate, bookRequest.NoOfDays)

    bookData.returnDate = addDaysToDate(bookData.returnDate, bookRequest.NoOfDays)

    bookRequest.status = "approved"

    await requestData.save();
    await getAllottedBookData.save();

    console.log(bookData.returnDate, bookRequest.NoOfDays)

    return res.status(200).json({message:"Request accepted successfully", success:true})


  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal Server Error", success:false})
  }
}

export const rejectRequest = async(req, res)=>{
  const {student_id, bookId} = req.body;

  try {
    
    let requestData = await ExtensionRequests.findOne({student_id:student_id})

    const bookRequest =  requestData.bookRequests.find((Book)=>{
      return Book.bookId.toString()===bookId.toString()
    })

    bookRequest.status = "rejected"

    await requestData.save();

    return res.status(200).json({message:"Request rejected successfully", success:true})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal Server Error", success:false})
  }
}