import nodemailer from 'nodemailer';
import { AllottedBooks } from '../Models/AllottedBooks.js';
import { User } from '../Models/User.js';
import { Books } from '../Models/Books.js'; 

function formatDateToDDMMYYYY(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear(); 
  return `${dd}-${mm}-${yyyy}`;
}


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendDueDateReminders = async () => {
  console.log('📅 Sending due date reminders...');
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const targetDate = formatDateToDDMMYYYY(threeDaysFromNow);

  // console.log(`Target date for reminders: ${targetDate}`);
  try {
    const allRecords = await AllottedBooks.find({});
    // console.log(allRecords)

    for (const record of allRecords) {
      const student = await User.findOne({ URN: record.URN });
      
      if (!student || !student.email) continue;
      // console.log(student)

      for (const bookEntry of record.books) {
        if (bookEntry.returnDate === targetDate) {
          console.log("Entered in book entry loop")
          const book = await Books.findById(bookEntry.bookId);
          // console.log(book);
          if (!book) continue;

          const mailOptions = {
            from: `"Library Admin" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: `📚 Reminder: Return "${book.title}" by ${targetDate}`,
            text: `Hello ${student.name},\n\nYour book "${book.title}" is due on ${targetDate}.\nPlease return or renew it in time to avoid any fine.\n\n– Library Admin`,
          };

          await transporter.sendMail(mailOptions);
          // console.log(`📧 Sent to ${student.email} for book "${book.title}"`);
        }
      }
    }

  } catch (err) {
    console.error('❌ Error in sending due date reminders:', err);
  }
};
