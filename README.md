
# 📚 Library Management System - Backend API

This is the backend API for the **Library Management System** built with **Node.js**, **Express.js**, and **MongoDB**, supporting both **student** and **admin** roles with secure **JWT authentication**.

---

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT with httpOnly cookies
- **File Upload**: Cloudinary
- **Payment**: Razorpay integration
- **Emailing**: Nodemailer

---

## 📁 Project Structure

```
📦lms_api
 ┣ 📂Controllers
 ┣ 📂Models
 ┣ 📂Routes
 ┣ 📂Utils
 ┣ 📂Middlewares
 ┣ 📂Data
 ┃ ┣ 📄config.dev.env
 ┃ ┗ 📄config.prod.env
 ┣ 📄server.js
 ┗ 📄package.json
```

---

## 📡 Main API Routes

| Method | Endpoint                             | Description                      | Access      |
|--------|--------------------------------------|----------------------------------|-------------|
| POST   | `/api/register`                      | Register new user                | Public      |
| POST   | `/api/login`                         | Login and set cookie             | Public      |
| GET    | `/api/verifyToken`                   | Verify token and get role        | Authenticated |
| POST   | `/api/admin/addBook`                 | Add new book                     | Admin       |
| GET    | `/api/admin/allBooks`                | Get all books                    | Admin       |
| POST   | `/api/student/requestExtension`      | Request extension                | Student     |
| GET    | `/api/student/extensionHistory`      | View extension request history   | Student     |
| POST   | `/api/admin/handleExtension`         | Accept/reject extension          | Admin       |
| POST   | `/api/admin/allotBook`               | Allot book to student            | Admin       |
| GET    | `/api/student/allottedBooks`         | View allotted books              | Student     |
| GET    | `/api/student/penalty`               | View penalties                   | Student     |

_(More APIs included in source)_

---

## 🌐 API Base URL

- **Dev**: `http://localhost:PORT`
- **Production**: `https://your-api.onrender.com`

---

## 🔐 Authentication Flow

- Login/Register → receives JWT (httpOnly cookie)
- Use `/verifyToken` to check auth status on frontend
- Role is stored for route protection

---

## ✅ Role-Based Access

- `student`: Can issue, return, request extension, and pay penalty.
- `admin`: Can manage books, handle extension requests, update penalty amount, and track user activity.

---

## ⚙️ Environment Configuration

Use separate environment files for **development** and **production**.

### 1. `config.dev.env` (for local development)

```env
NODE_ENV=development
PORT=Port_no
MONGODB_URI=Your-mongoDB-URI
TOKEN_KEY=your-dev-secret
FRONTEND_URL=Your-react-frontend-URL

RAZORPAY_KEY_ID=your-test-key-id
RAZORPAY_SECRET_KEY=your-test-secret

CLOUDINARY_API_KEY=your-dev-key
CLOUDINARY_API_SECRET=your-dev-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name

EMAIL_USER=youremail@example.com
EMAIL_PASSWORD=your-app-password
```

### 2. `config.prod.env` (for deployment)

```env
NODE_ENV=production
PORT=Port_no
MONGODB_URI=your-production-uri
TOKEN_KEY=your-prod-secret
FRONTEND_URL=https://your-frontend.vercel.app

RAZORPAY_KEY_ID=your-live-key-id
RAZORPAY_SECRET_KEY=your-live-secret

CLOUDINARY_API_KEY=your-prod-key
CLOUDINARY_API_SECRET=your-prod-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name

EMAIL_USER=youremail@example.com
EMAIL_PASSWORD=your-app-password
```

### 🧠 Auto-load correct config in `server.js`

```js
import dotenv from 'dotenv';

const envPath = process.env.NODE_ENV === 'production'
  ? './Data/config.prod.env'
  : './Data/config.dev.env';

dotenv.config({ path: envPath });
```

---

## 🚀 Deployment Instructions

### On Render (Backend):

1. Push code to a GitHub private repo.
2. Connect Render to that repo.
3. Set environment variables from `config.prod.env`.
4. Set Build Command: `npm install`
5. Set Start Command: `node server.js` (or `npm start`)

### On Vercel (Frontend):

1. Deploy your React/Vite frontend.
2. Set your VITE_API_URL to your Render API endpoint in Vercel Environment Settings.

---

## 🔒 Security

- `httpOnly` cookies for secure authentication
- Role-based route protection
- Middleware-based token checks
- Input validation and sanitization

---

## 🧪 Testing

Use **Postman** or frontend integration with `withCredentials: true` for cookie-based auth.

---

## 📸 File Uploads

Integrated with **Cloudinary** for book cover images.

---

## 📧 Email Service

Email uses [Nodemailer](https://nodemailer.com) with your Gmail or custom SMTP settings. Ensure your Gmail allows **less secure app access** or generate an **App Password** if 2FA is on.

---

## 💳 Razorpay Payments

Used for **penalty payments**. Keys are loaded from the environment.
