
import jwt from "jsonwebtoken";

export const generateCookie = (user, res, statusCode=200, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(201)
    .cookie("LMS_Token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    })
    .json({ message: message, success: true });
}

