import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === 'production' ? './Data/config.prod.env' : './Data/config.dev.env';
dotenv.config({ path: envFile });
import crypto from "crypto";
import { Payment } from "../Models/Payment.js";
import Razorpay from "razorpay";
import { AllottedBooks } from "../Models/AllottedBooks.js";


const extendDueDates = async (bookIds, studentURN) => {
  try {
    let student = await AllottedBooks.findOne({URN: studentURN});

    // console.log(student)

    if (!student) {
      throw new Error("Student not found");
    }

    student.books = student.books.map((borrowedBook) => {
      const matchedBook = bookIds.find(
        (book) => borrowedBook.bookId.toString() === book.bookId.toString()
      );

      if (matchedBook) {
        const [day, month, year] = borrowedBook.returnDate.split("-");
        let dateObj = new Date(`${year}-${month}-${day}`);

        
        dateObj.setDate(dateObj.getDate() + Number(matchedBook.DaysOverDue));

        // Format back to "DD-MM-YYYY"
        const extendedDate = `${String(dateObj.getDate()).padStart(2, "0")}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${dateObj.getFullYear()}`;

        borrowedBook.returnDate = extendedDate;
      }

      return borrowedBook;
    });

    await student.save();

    // console.log(" Due dates extended by 5 days and saved successfully.");
  } catch (error) {
    console.error(" Error extending due dates:", error.message);
  }
};


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

export const checkout = async (req, res) => {
  const { amount, studentId, bookIds } = req.body;

  var options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `reciept_${studentId}`,
  }

  try {
    const order = await razorpay.orders.create(options);

    return res.status(201).json({
      orderId: order.id,
      amount: amount,
      bookIds,
      studentId,
      payStatus: "created"
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong", success: false });
  }


}

export const Verify = async (req, res) => {

  const { studentId,
    studentURN,
    orderId,
    amount,
    bookIds,
    razorpay_payment_id,
    razorpay_signature } = req.body;

     const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(`${orderId}|${razorpay_payment_id}`)
    .digest("hex");

    if (generated_signature === razorpay_signature) {
   
    // console.log(" Payment verified successfully");

    let payment = await Payment.create({
    studentId,
    studentURN,
    orderId,
    amount,
    bookIds,
    razorpay_payment_id,
    razorpay_signature
    })
    
    extendDueDates(bookIds,studentURN);
    

    res.status(200).json({ success: true, message: "Payment verified successfully", payment });
  } else {
    
    console.error(" Payment verification failed");
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }

}