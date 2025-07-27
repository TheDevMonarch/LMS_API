import jwt from "jsonwebtoken";

export const generateCookie = (user, res, statusCode=200, message) => {
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.TOKEN_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(statusCode)
    .cookie("LMS_Token", token, {
      httpOnly: true,
      sameSite: "None", 
      secure: true, 
      maxAge: 1000 * 60 * 60 * 24,
    })
    .json({ message: message, role:user.role, success: true });
}


export const verifyToken = (req, res) => {
  const token = req.cookies.LMS_Token;
  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return res.json({ isAuthenticated: true, userId: decoded.userId, role: decoded.role });
  } catch (err) {
    return res.json({ isAuthenticated: false });
  }
};