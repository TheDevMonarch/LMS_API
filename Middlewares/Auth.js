import jwt from 'jsonwebtoken'



export const isAuthorized = (req, res, next)=>{

  let {LMS_Token} = req.cookies

  if(!LMS_Token){
    return res.json({message:"Login First"})
  }

  let decoded = jwt.verify(LMS_Token, process.env.TOKEN_KEY)


  let user = decoded.userId;

  req.user = user;

  next();

}