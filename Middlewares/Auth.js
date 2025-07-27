import jwt from 'jsonwebtoken'



export const isAuthorized = (req, res, next)=>{

  let {LMS_Token} = req.cookies

  if(!LMS_Token){
    return res.status(401).json({message:"Login First"})
  }

  let decoded = jwt.verify(LMS_Token, process.env.TOKEN_KEY)

  let user = decoded.userId;
  let role = decoded.role;

  req.user = user;
  req.role = role;

  next();

}

export const isAdmin = (req, res, next)=>{
  let role = req.role;

  if(!(role === 'admin')){
    return res.status(403).json({message:"Admin Only!", success:false})
  }

  next();
}